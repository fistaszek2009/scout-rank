import express from 'express'
import { checkSession } from '../../../utils/session'
import { prisma } from '../../../lib/prisma'
import { validatePayload, validateName, validateId } from '../../../utils/validate';

export default function postEditTroop(app: express.Application) {
    app.post('/api/v1/editTroop/:targetId', async (req, res) => {
        const payload = req.body;
        const payloadValidationRes = validatePayload(payload);
        if (!payloadValidationRes.correct) {
            res.status(payloadValidationRes.statusCode).send('payload: ' + payloadValidationRes.message);
            return;
        }

        const targetId = Number(req.params.targetId);
        const name = payload.name;
        const userId = payload.userId;
        const sessionSecret = payload.sessionSecret;

        const userIdValidationRes = validateId(userId);
        if (!userIdValidationRes.correct) {
            res.status(userIdValidationRes.statusCode).send('userId: ' + userIdValidationRes.message);
            return;
        }

        if (!(await checkSession(userId, sessionSecret))) {
            res.sendStatus(401);
            return;
        }

        const user = await prisma.user.findUnique({ where: { id: userId }, include: { event: { include: { troop: true } } } });
        if (!user) {
            res.sendStatus(401);
            return;
        }

        if (!(user.assistantOfTroopId || user.leaderOfTroopId)) {
            res.sendStatus(403);
            return;
        }

        const targetIdValidationRes = validateId(targetId);
        if (!targetIdValidationRes.correct) {
            res.status(targetIdValidationRes.statusCode).send('targetId: ' + targetIdValidationRes.message);
            return;
        }

        const nameValidationRes = validateName(name, true, true);
        if (!nameValidationRes.correct) {
            res.status(nameValidationRes.statusCode).send('name: ' + nameValidationRes.message);
            return;
        }

        const target = await prisma.troop.findUnique({ where: { id: targetId }, include: { event: true } });
        if (!target) {
            res.sendStatus(401);
            return;
        }

        if (target.event?.id !== user.eventId) {
            res.sendStatus(403);
            return;
        }

        const updatedTarget = await prisma.troop.update({
            where: {
                id: target.id
            },
            data: {
                name: name
            }
        });

        res.sendStatus(200);
    });

    return app;
}