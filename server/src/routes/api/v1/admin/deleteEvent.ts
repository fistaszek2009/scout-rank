import express from 'express'
import { checkSession } from '../../../../utils/session'
import { prisma } from '../../../../lib/prisma'
import { validatePayload, validateId } from '../../../../utils/validate';

export default function postDeleteEvent(app: express.Application) {
    app.post('/api/v1/admin/deleteEvent/:targetId', async (req, res) => {
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

        if (!user.leaderOfTroopId) {
            res.sendStatus(403);
            return;
        }

        const targetIdValidationRes = validateId(targetId);
        if (!targetIdValidationRes.correct) {
            res.status(targetIdValidationRes.statusCode).send('targetId: ' + targetIdValidationRes.message);
            return;
        }

        const target = await prisma.event.findUnique({ where: { id: targetId }, include: { troop: true } });
        if (!target) {
            res.sendStatus(400);
            return;
        }

        if (target.id !== user.eventId) {
            res.sendStatus(403);
            return;
        }

        const troopId = target.troopId;
        
        await prisma.session.deleteMany({ where: { user: { eventId: target.id } } });
        await prisma.userTaskScore.deleteMany({ where: { user: { eventId: target.id } } });
        await prisma.user.deleteMany({ where: { eventId: target.id } });
        await prisma.patrolTaskScore.deleteMany({ where: { patrol: { troop: { event: { id: target.id } } } } });
        await prisma.patrol.deleteMany({ where: { troop: { event: { id: target.id } } } });
        await prisma.task.deleteMany({ where: { taskTemplate: { eventId: target.id } } });
        await prisma.taskTemplate.deleteMany({ where: { eventId: target.id } });
        await prisma.event.delete({ where: { id: target.id } });
        await prisma.troop.delete({ where: { id: troopId } });

        res.sendStatus(200);
    });

    return app;
}