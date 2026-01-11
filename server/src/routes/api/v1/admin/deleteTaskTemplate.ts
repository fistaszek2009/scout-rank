import express from 'express'
import { checkSession } from '../../../../utils/session'
import { prisma } from '../../../../lib/prisma'
import { validatePayload, validateId } from '../../../../utils/validate';

export default function postDeleteTaskTemplate(app: express.Application) {
    app.post('/api/v1/admin/deleteTaskTemplate/:targetId', async (req, res) => {
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

        const target = await prisma.taskTemplate.findUnique({ where: { id: targetId } });
        if (!target) {
            res.sendStatus(400);
            return;
        }

        if (target.eventId !== user.eventId) {
            res.sendStatus(403);
            return;
        }

        await prisma.userTaskScore.deleteMany({ where: { task: { taskTemplateId: targetId } } });
        await prisma.patrolTaskScore.deleteMany({ where: { task: { taskTemplateId: targetId } } });
        await prisma.task.deleteMany({ where: { taskTemplateId: targetId } });
        await prisma.taskTemplate.delete({ where: { id: targetId } });

        res.sendStatus(200);
    });

    return app;
}