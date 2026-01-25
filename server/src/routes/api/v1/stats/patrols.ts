import express from 'express'
import { checkSession } from '../../../../utils/session'
import { prisma } from '../../../../lib/prisma'
import { validatePayload, validateId } from '../../../../utils/validate';

export default function postPatrols(app: express.Application) {
    app.post('/api/v1/stats/patrols', async (req, res) => {
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

        const patrols = await prisma.patrol.findMany({ where: { troop: { event: { id: user.eventId ?? undefined } } }, include: { tasksScores: true } });
        const ranking = patrols.map((patrol) => {
            return {
                id: patrol.id,
                name: patrol.name,
                totalScore: patrol.tasksScores.reduce((a, x) => a + x.score, 0)
            }
        });

        res.json(ranking);
    });

    return app;
}