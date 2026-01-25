import express from 'express'
import { checkSession } from '../../../../utils/session'
import { prisma } from '../../../../lib/prisma'
import { validatePayload, validateId } from '../../../../utils/validate';

export default function postGlobal(app: express.Application) {
    app.post('/api/v1/stats/global', async (req, res) => {
        const payload = req.body;
        const payloadValidationRes = validatePayload(payload);
        if (!payloadValidationRes.correct) {
            res.status(payloadValidationRes.statusCode).send('payload: ' + payloadValidationRes.message);
            return;
        }

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

        const scouts = await prisma.user.findMany({ where: { eventId: user.eventId, assistantOfTroopId: null, leaderOfTroopId: null }, include: { taskScores: true, patrol: true } });
        const ranking = scouts.map((scout) => {
            return {
                id: scout.id,
                firstName: scout.firstName,
                patrolId: scout.patrolId,
                patrolName: scout.patrol?.name,
                totalScore: scout.taskScores.reduce((a, x) => a + x.score, 0)
            }
        });

        res.json(ranking);
    });

    return app;
}