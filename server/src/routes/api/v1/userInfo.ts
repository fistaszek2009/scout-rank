import express from 'express'
import { validatePayload, validateId } from '../../../utils/validate'
import { prisma } from '../../../lib/prisma'
import { checkSession } from '../../../utils/session'

export default function getUserInfo(app: express.Application) {
    app.get('/api/v1/userInfo/:targetId', async (req, res) => {
        const payload = req.body;
        const payloadValidationRes = validatePayload(payload);
        if (!payloadValidationRes.correct) {
            res.status(payloadValidationRes.statusCode).send('payload: ' + payloadValidationRes.message);
            return;
        }

        const userId = payload.userId;
        const targetId = Number(req.params.targetId);
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

        const user = await prisma.user.findUnique({ where: { id: userId }, include: { event: true } });
        if (!user) {
            res.sendStatus(401);
            return;
        }

        const target = await prisma.user.findUnique({ where: { id: targetId }, include: { event: true } });
        if (!target) {
            res.status(400).send('targetId: User does not exist!');
            return;
        }

        if (user.eventId !== target.eventId) {
            res.sendStatus(403);
            return;
        }

        if ((user.assistantOfTroopId || user.leaderOfTroopId) 
            || (user.leaderOfPatrolId && user.patrolId == target.patrolId) 
            || user.id == target.id) {
            res.status(200).json(await prisma.user.findUnique({
                where: { id: targetId },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    patrolId: true,
                    leaderOfPatrolId: true,
                    leaderOfTroopId: true,
                    assistantOfTroopId: true,
                    eventId: true
                }
            }));
            return;
        }

        res.sendStatus(403);
    });
    return app;
}