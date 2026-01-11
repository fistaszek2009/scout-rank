import express from 'express'
import { checkSession } from '../../../../utils/session'
import { prisma } from '../../../../lib/prisma'
import { validatePayload, validateName, validateId, validateBoolean, validateDescription, validatePositiveInteger } from '../../../../utils/validate';

export default function postCreateTaskTemplate(app: express.Application) {
    app.post('/api/v1/admin/createTaskTemplate', async (req, res) => {
        const payload = req.body;
        const payloadValidationRes = validatePayload(payload);
        if (!payloadValidationRes.correct) {
            res.status(payloadValidationRes.statusCode).send('payload: ' + payloadValidationRes.message);
            return;
        }

        const title = payload.title;
        const description = payload.description;
        const maxPoints = payload.maxPoints;
        const isIndividual = payload.isIndividual;
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

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            res.sendStatus(401);
            return;
        }

        if (!(user.assistantOfTroopId || user.leaderOfTroopId)) {
            res.sendStatus(403);
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

        const isIndividualValidationRes = validateBoolean(isIndividual);
        if (!isIndividualValidationRes.correct) {
            res.status(isIndividualValidationRes.statusCode).send('isIndividual: ' + isIndividualValidationRes.message);
            return;
        }

        const isOptionalValidationRes = validateBoolean(isOptional);
        if (!isOptionalValidationRes.correct) {
            res.status(isOptionalValidationRes.statusCode).send('isOptional: ' + isOptionalValidationRes.message);
            return;
        }

        const target = await prisma.taskTemplate.findFirst({
            where: {
                title: title,
                eventId: user.eventId!
            }
        });

        if (target) {
            res.status(400).send('title: Task template with such title already exists!');
            return;
        }
        
        const newTaskTemplate = await prisma.taskTemplate.create({
            data: {
                title: title,
                description: description,
                maxPoints: maxPoints,
                individualTask: isIndividual,
                optional: isOptional,
                eventId: user.eventId!
            }
        });

        res.status(201).json({ id: newTaskTemplate.id });
    });

    return app;
}