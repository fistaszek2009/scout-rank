import express from 'express'
import { validatePayload, validateId } from '../../../../utils/validate'
import { prisma } from '../../../../lib/prisma'
import { checkSession } from '../../../../utils/session'

export default function postTask(app: express.Application) {
    app.post('/api/v1/info/task/:taskId', async (req, res) => {
        const payload = req.body;
        const payloadValidationRes = validatePayload(payload);
        if (!payloadValidationRes.correct) {
            res.status(payloadValidationRes.statusCode).send('payload: ' + payloadValidationRes.message);
            return;
        }

        const userId = payload.userId;
        const taskId = Number(req.params.taskId);
        const sessionSecret = payload.sessionSecret;

        const userIdValidationRes = validateId(userId);
        if (!userIdValidationRes.correct) {
            res.status(userIdValidationRes.statusCode).send('userId: ' + userIdValidationRes.message);
            return;
        }

        const taskIdValidationRes = validateId(taskId);
        if (!taskIdValidationRes.correct) {
            res.status(taskIdValidationRes.statusCode).send('taskId: ' + taskIdValidationRes.message);
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

        const task = await prisma.task.findUnique({ where: { id: taskId }, include: { taskTemplate: true } });
        if (!task) {
            res.sendStatus(400);
            return;
        }

        if (user.eventId !== task.taskTemplate.eventId ) {
            res.sendStatus(403);
            return;
        }

        res.status(200).json({
            id: task.id,
            taskDate: task.date,
            taskTemplateId: task.taskTemplateId
        });
    });
    return app;
}