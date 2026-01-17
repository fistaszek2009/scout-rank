import express from 'express'
import { validatePayload, validateId } from '../../../../utils/validate'
import { prisma } from '../../../../lib/prisma'
import { checkSession } from '../../../../utils/session'

export default function postUser(app: express.Application) {
    app.post('/api/v1/info/user/:targetId', async (req, res) => {
        const payload = req.body;
        const payloadValidationRes = validatePayload(payload);
        if (!payloadValidationRes.correct) {
            res.status(payloadValidationRes.statusCode).send('payload: ' + payloadValidationRes.message);
            return;
        }

        const userId = payload.userId;
        const targetId = Number(req.params.targetId);
        const sessionSecret = payload.sessionSecret;

        const userIdValidationRes = validateId(userId);
        if (!userIdValidationRes.correct) {
            res.status(userIdValidationRes.statusCode).send('userId: ' + userIdValidationRes.message);
            return;
        }

        const targetIdValidationRes = validateId(targetId);
        if (!targetIdValidationRes.correct) {
            res.status(targetIdValidationRes.statusCode).send('targetId: ' + targetIdValidationRes.message);
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

        const target = await prisma.user.findUnique({ where: { id: targetId } });
        if (!target) {
            res.status(400).send('targetId: User does not exist!');
            return;
        }

        if (user.eventId !== target.eventId) {
            res.sendStatus(403);
            return;
        }

        if ((user.assistantOfTroopId || user.leaderOfTroopId) 
            || (user.leaderOfPatrolId && user.patrolId == target.patrolId) 
            || user.id == target.id) {

            const userTaskScores = await prisma.userTaskScore.findMany({
                where: {
                    userId: target.id
                }
            });

            res.status(200).json({
                id: target.id,
                firstName: target.firstName,
                lastName: target.lastName,
                patrolId: target.patrolId,
                leaderOfPatrolId: target.leaderOfPatrolId,
                leaderOfTroopId: target.leaderOfTroopId,
                assistantOfTroopId: target.assistantOfTroopId,
                eventId: target.eventId,
                scores: userTaskScores.map((userTaskScore) => {
                    return {
                        id: userTaskScore.id,
                        score: userTaskScore.score,
                        taskId: userTaskScore.taskId,
                    }
                })
            });
            return;
        }

        res.sendStatus(403);
    });
    return app;
}