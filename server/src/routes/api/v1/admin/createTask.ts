import express from 'express'
import { checkSession } from '../../../../utils/session'
import { prisma } from '../../../../lib/prisma'
import { validatePayload, validateName, validateId, validateBoolean, validateDescription, validatePositiveInteger, parseAndValidateDate } from '../../../../utils/validate';

export default function postCreateTask(app: express.Application) {
    app.post('/api/v1/admin/createTask', async (req, res) => {
        const payload = req.body;
        const payloadValidationRes = validatePayload(payload);
        if (!payloadValidationRes.correct) {
            res.status(payloadValidationRes.statusCode).send('payload: ' + payloadValidationRes.message);
            return;
        }

        const taskTemplateId = payload.taskTemplateId;
        const taskDateStr = payload.taskDate;
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

        const { date: taskDate, result: taskDateValidationRes } = parseAndValidateDate(taskDateStr);
        if (!taskDateValidationRes.correct) {
            res.status(taskDateValidationRes.statusCode).send('taskDate: ' + taskDateValidationRes.message);
            return;
        }

        const taskTemplateIdValidationRes = validateId(taskTemplateId);
        if (!taskTemplateIdValidationRes.correct) {
            res.status(taskTemplateIdValidationRes.statusCode).send('taskTemplateId: ' + taskTemplateIdValidationRes.message);
            return;
        }

        const taskTemplate = await prisma.taskTemplate.findUnique({ where: { id: taskTemplateId } });
        if (!taskTemplate) {
            res.sendStatus(400);
            return;
        }
        
        const newTask = await prisma.task.create({
            data: {
                taskTemplateId: taskTemplate.id,
                date: taskDate
            }
        });

        res.status(201).json({ id: newTask.id });
    });

    return app;
}