import express from 'express'
import { validatePayload, validateId } from '../../../../utils/validate'
import { prisma } from '../../../../lib/prisma'
import { checkSession } from '../../../../utils/session'

export default function getEvent(app: express.Application) {
    app.get('/api/v1/info/event/:eventId', async (req, res) => {
        const payload = req.body;
        const payloadValidationRes = validatePayload(payload);
        if (!payloadValidationRes.correct) {
            res.status(payloadValidationRes.statusCode).send('payload: ' + payloadValidationRes.message);
            return;
        }

        const userId = payload.userId;
        const eventId = Number(req.params.eventId);
        const sessionSecret = payload.sessionSecret;

        const userIdValidationRes = validateId(userId);
        if (!userIdValidationRes.correct) {
            res.status(userIdValidationRes.statusCode).send('userId: ' + userIdValidationRes.message);
            return;
        }

        const eventIdValidationRes = validateId(eventId);
        if (!eventIdValidationRes.correct) {
            res.status(eventIdValidationRes.statusCode).send('eventId: ' + eventIdValidationRes.message);
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

        const event = await prisma.event.findUnique({ where: { id: eventId } });
        if (!event) {
            res.sendStatus(400);
            return;
        }

        if (user.eventId !== event.id ) {
            res.sendStatus(403);
            return;
        }

        const taskTemplates = await prisma.taskTemplate.findMany({ where: { eventId: event.id } });

        res.status(200).json({
            id: event.id,
            name: event.name,
            troopId: event.troopId,
            startDate: event.startDate,
            endDate: event.endDate,
            taskTemplateIds: taskTemplates.map((taskTemplate) => taskTemplate.id)
        });
    });
    return app;
}