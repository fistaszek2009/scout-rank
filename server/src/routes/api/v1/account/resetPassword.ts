import express from 'express'
import { checkSession } from '../../../../utils/session'
import { prisma } from '../../../../lib/prisma'
import { validatePayload, validatePassword, validateId } from '../../../../utils/validate';
import { hashPassword } from '../../../../utils/password';
import crypto from 'node:crypto'

export default function postResetPassword(app: express.Application) {
    app.post('/api/v1/account/resetPassword', async (req, res) => {
        const payload = req.body;
        const payloadValidationRes = validatePayload(payload);
        if (!payloadValidationRes.correct) {
            res.status(payloadValidationRes.statusCode).send('payload: ' + payloadValidationRes.message);
            return;
        }

        const userId = payload.userId;
        const targetId = payload.targetId;
        const sessionSecret = payload.sessionSecret;

        const userIdValidationRes = validateId(userId);
        if (!userIdValidationRes.correct) {
            res.status(userIdValidationRes.statusCode).send('userId: ' + userIdValidationRes.message);
            return;
        }

        const targetIdValidationRes = validateId(targetId);
        if (!targetIdValidationRes.correct) {
            res.status(targetIdValidationRes.statusCode).send('targetId: ' + targetIdValidationRes.message);
            return;
        }

        if (!(await checkSession(userId, sessionSecret))) {
            res.sendStatus(401);
            return;
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            res.sendStatus(401);
            return;
        }

        const target = await prisma.user.findUnique({ where: { id: targetId } });
        if (!target) {
            res.status(400).send('targetId: User does not exist!');
            return;
        }

        if (userId == targetId) {
            if (payload.newPassword) {
                const newPassword = payload.newPassword;
                const newPasswordValidationRes = validatePassword(newPassword);
                if (!newPasswordValidationRes.correct) {
                    res.status(newPasswordValidationRes.statusCode).send('newPassword:' + newPasswordValidationRes.message);
                    return;
                }

                await prisma.user.update({ where: { id: target.id }, data: { passwordHash: hashPassword(newPassword) } });

                res.sendStatus(200);
                return;
            }

            const newPassword = crypto.randomBytes(8).toString("hex");
            const updateTarget = await prisma.user.update({ where: { id: target.id }, data: { passwordHash: hashPassword(newPassword) } });
            
            res.status(200).json({ newPassword: newPassword });
            return;
        }

        if (!(user.assistantOfTroopId || user.leaderOfTroopId)) {
            res.sendStatus(403);
            return;
        }
        
        if (user.eventId !== target.eventId) {
            res.sendStatus(403);
            return;
        }

        const newPassword = crypto.randomBytes(8).toString("hex");
        const updateTarget = await prisma.user.update({ where: { id: target.id }, data: { passwordHash: hashPassword(newPassword) } });

        res.status(200).json({ newPassword: newPassword });
    });

    return app;
}