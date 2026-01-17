import express from 'express'
import { validatePayload, validateId } from '../../../../utils/validate'
import { prisma } from '../../../../lib/prisma'
import { checkSession } from '../../../../utils/session'

export default function postTaskTemplate(app: express.Application) {
    app.post('/api/v1/info/taskTemplate/:taskTemplateId', async (req, res) => {
        const payload = req.body;
        const payloadValidationRes = validatePayload(payload);
        if (!payloadValidationRes.correct) {
            res.status(payloadValidationRes.statusCode).send('payload: ' + payloadValidationRes.message);
            return;
        }

        const userId = payload.userId;
        const taskTemplateId = Number(req.params.taskTemplateId);
        const sessionSecret = payload.sessionSecret;

        const userIdValidationRes = validateId(userId);
        if (!userIdValidationRes.correct) {
            res.status(userIdValidationRes.statusCode).send('userId: ' + userIdValidationRes.message);
            return;
        }

        const taskTemplateIdValidationRes = validateId(taskTemplateId);
        if (!taskTemplateIdValidationRes.correct) {
            res.status(taskTemplateIdValidationRes.statusCode).send('taskTemplateId: ' + taskTemplateIdValidationRes.message);
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

        const taskTemplate = await prisma.taskTemplate.findUnique({ where: { id: taskTemplateId } });
        if (!taskTemplate) {
            res.sendStatus(400);
            return;
        }

        if (user.eventId !== taskTemplate.eventId ) {
            res.sendStatus(403);
            return;
        }

        res.status(200).json({
            id: taskTemplate.id,
            title: taskTemplate.title,
            description: taskTemplate.description,
            maxPoints: taskTemplate.maxPoints,
            isIndividual: taskTemplate.individualTask,
            isOptional: taskTemplate.optional
        });
    });
    return app;
}