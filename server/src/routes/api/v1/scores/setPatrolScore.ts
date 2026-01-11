import express from 'express'
import { checkSession } from '../../../../utils/session'
import { prisma } from '../../../../lib/prisma'
import { validatePayload, validateId, parseAndValidateDate, validateNonnegativeInteger} from '../../../../utils/validate';

export default function postSetPatrolScore(app: express.Application) {
    app.post('/api/v1/scores/setPatrolScore/:targetId', async (req, res) => {
        const payload = req.body;
        const payloadValidationRes = validatePayload(payload);
        if (!payloadValidationRes.correct) {
            res.status(payloadValidationRes.statusCode).send('payload: ' + payloadValidationRes.message);
            return;
        }

        const targetId = Number(req.params.targetId);
        const taskId = payload.taskId;
        const score = payload.score;
        const timestampStr = payload.timestamp;
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

        const { date: timestamp, result: timestampValidationRes } = parseAndValidateDate(timestampStr);
        if (!timestampValidationRes.correct) {
            res.status(timestampValidationRes.statusCode).send('timestamp: ' + timestampValidationRes.message);
            return;
        }

        const taskIdValidationRes = validateId(taskId);
        if (!taskIdValidationRes.correct) {
            res.status(taskIdValidationRes.statusCode).send('taskId: ' + taskIdValidationRes.message);
            return;
        }

        const target = await prisma.patrol.findUnique({ where: { id: targetId }, include: { troop: { include: { event: true } } } });
        if (!target) {
            res.sendStatus(400);
            return;
        }

        if (target.troop.event?.id !== user.eventId) {
            res.sendStatus(403);
            return;
        }

        const task = await prisma.task.findUnique({ where: { id: taskId, taskTemplate: { individualTask: false } }, include: { taskTemplate: true } });
        if (!task) {
            res.sendStatus(400);
            return;
        }

        if (task.taskTemplate.eventId !== user.eventId) {
            res.sendStatus(403);
            return;
        }

        if (task.taskTemplate.maxPoints < score) {
            res.sendStatus(400);
            return;
        }

        const scoreValidationRes = validateNonnegativeInteger(score);
        if (!scoreValidationRes.correct) {
            res.status(scoreValidationRes.statusCode).send('score: ' + scoreValidationRes.message);
            return;
        }
        
        const taskScore = await prisma.patrolTaskScore.findFirst({
            where: {
                patrolId: targetId,
                taskId: taskId
            }
        });

        if (taskScore) {
            if (taskScore.timestamp > timestamp) {
                res.status(200).send('Newer record already available!');
                return;
            }

            const updatedTaskScore = await prisma.patrolTaskScore.update({
                where: {
                    id: taskScore.id
                },
                data: {
                    score: score,
                    timestamp: timestamp
                }
            })
            res.sendStatus(200);
            return;
        }

        const newTaskScore = await prisma.patrolTaskScore.create({
            data: {
                taskId: taskId,
                patrolId: targetId,
                score: score,
                timestamp: timestamp
            }
        })

        res.sendStatus(200);
    });

    return app;
}