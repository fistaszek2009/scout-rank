import express from 'express'
import { checkSession } from '../../../../utils/session'
import { prisma } from '../../../../lib/prisma'
import { validatePayload, validateId } from '../../../../utils/validate';

export default function postDeleteTask(app: express.Application) {
    app.post('/api/v1/admin/deleteTask/:targetId', async (req, res) => {
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

        const target = await prisma.task.findUnique({ where: { id: targetId }, include: { taskTemplate: true } });
        if (!target) {
            res.sendStatus(400);
            return;
        }

        if (target.taskTemplate.eventId !== user.eventId) {
            res.sendStatus(403);
            return;
        }

        await prisma.userTaskScore.deleteMany({ where: { taskId: target.id } });
        await prisma.patrolTaskScore.deleteMany({ where: { taskId: target.id } });
        await prisma.task.delete({ where: { id: targetId } });

        res.sendStatus(200);
    });

    return app;
}