import express from 'express'
import { checkSession } from '../../../../utils/session'
import { prisma } from '../../../../lib/prisma'
import { validatePayload, validateId, parseAndValidateDate } from '../../../../utils/validate';

export default function postEditTask(app: express.Application) {
    app.post('/api/v1/admin/editTask/:targetId', async (req, res) => {
        const payload = req.body;
        const payloadValidationRes = validatePayload(payload);
        if (!payloadValidationRes.correct) {
            res.status(payloadValidationRes.statusCode).send('payload: ' + payloadValidationRes.message);
            return;
        }

        const targetId = Number(req.params.targetId);
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

        const targetIdValidationRes = validateId(targetId);
        if (!targetIdValidationRes.correct) {
            res.status(targetIdValidationRes.statusCode).send('targetId: ' + targetIdValidationRes.message);
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

        const target = await prisma.task.findUnique({ where: { id: targetId }, include: { taskTemplate: true } });
        if (!target) {
            res.sendStatus(400);
            return;
        }

        if (target.taskTemplate.eventId !== user.eventId) {
            res.sendStatus(403);
            return;
        }

        if (taskTemplate.eventId !== user.eventId) {
            res.sendStatus(403);
            return;
        }
        
        const updatedTarget = await prisma.task.update({
            where: {
                id: target.id
            },
            data: {
                taskTemplateId: taskTemplateId,
                date: taskDate
            }
        });

        res.sendStatus(200);
    });

    return app;
}