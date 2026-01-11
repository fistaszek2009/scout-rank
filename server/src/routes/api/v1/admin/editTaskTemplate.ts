import express from 'express'
import { checkSession } from '../../../../utils/session'
import { prisma } from '../../../../lib/prisma'
import { validatePayload, validateName, validateId, validateBoolean, validateDescription, validatePositiveInteger } from '../../../../utils/validate';

export default function postEditTaskTemplate(app: express.Application) {
    app.post('/api/v1/admin/editTaskTemplate/:targetId', async (req, res) => {
        const payload = req.body;
        const payloadValidationRes = validatePayload(payload);
        if (!payloadValidationRes.correct) {
            res.status(payloadValidationRes.statusCode).send('payload: ' + payloadValidationRes.message);
            return;
        }

        const targetId = Number(req.params.targetId);
        const title = payload.title;
        const description = payload.description;
        const maxPoints = payload.maxPoints;
        const isOptional = payload.isOptional;
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

        const titleValidationRes = validateName(title, true, true);
        if (!titleValidationRes.correct) {
            res.status(titleValidationRes.statusCode).send('title: ' + titleValidationRes.message);
            return;
        }

        const descriptionValidationRes = validateDescription(description);
        if (!descriptionValidationRes.correct) {
            res.status(descriptionValidationRes.statusCode).send('description: ' + descriptionValidationRes.message);
            return;
        }

        const maxPointsValidationRes = validatePositiveInteger(maxPoints);
        if (!maxPointsValidationRes.correct) {
            res.status(maxPointsValidationRes.statusCode).send('maxPoints: ' + maxPointsValidationRes.message);
            return;
        }

        const isOptionalValidationRes = validateBoolean(isOptional);
        if (!isOptionalValidationRes.correct) {
            res.status(isOptionalValidationRes.statusCode).send('isOptional: ' + isOptionalValidationRes.message);
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
        
        const newTarget = await prisma.taskTemplate.findFirst({
            where: {
                title: title,
                eventId: user.eventId!
            }
        });

        if (newTarget) {
            res.status(400).send('title: Task template with such title already exists!');
            return;
        }

        const updatedTarget = await prisma.taskTemplate.update({
            where: {
                id: target.id
            },
            data: {
                title: title,
                description: description,
                maxPoints: maxPoints,
                optional: isOptional
            }
        });

        res.sendStatus(200);
    });

    return app;
}