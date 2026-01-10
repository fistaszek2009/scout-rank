import express from 'express'
import { checkSession } from '../../../../utils/session'
import { prisma } from '../../../../lib/prisma'
import { validatePayload, validateId } from '../../../../utils/validate';

export default function postDeletePatrol(app: express.Application) {
    app.post('/api/v1/admin/deletePatrol/:targetId', async (req, res) => {
        const payload = req.body;
        const payloadValidationRes = validatePayload(payload);
        if (!payloadValidationRes.correct) {
            res.status(payloadValidationRes.statusCode).send('payload: ' + payloadValidationRes.message);
            return;
        }

        const targetId = Number(req.params.targetId);
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

        const user = await prisma.user.findUnique({ where: { id: userId } });
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

        const target = await prisma.patrol.findUnique({ where: { id: targetId }, include: { troop: { include: { event: true } } } });
        if (!target) {
            res.sendStatus(400);
            return;
        }

        if (target.troop.event?.id !== user.eventId) {
            res.sendStatus(403);
            return;
        }
        
        await prisma.session.deleteMany({ where: { user: { patrolId: target.id } } });
        await prisma.userTaskScore.deleteMany({ where: { user: { patrolId: target.id } } });
        await prisma.user.deleteMany({ where: { patrolId: target.id } });
        await prisma.patrolTaskScore.deleteMany({ where: { patrolId: target.id } })
        await prisma.patrol.delete({ where: { id: target.id } });

        res.sendStatus(200);
    });

    return app;
}