import express from 'express'
import { validatePayload, validateId } from '../../../../utils/validate'
import { prisma } from '../../../../lib/prisma'
import { checkSession } from '../../../../utils/session'

export default function postAllUsers(app: express.Application) {
    app.post('/api/v1/info/allUsers', async (req, res) => {
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

        if (!(user.assistantOfTroopId || user.leaderOfTroopId)) {
            res.sendStatus(403);
            return;
        }

        const users = await prisma.user.findMany({ where: { eventId: user.eventId }, include: { patrol: true } });

        res.json(users.map((x) => {
            return {
                id: x.id,
                firstName: x.firstName,
                lastName: x.lastName,
                patrolId: x.patrolId,
                patrolName: x.patrol?.name,
                leaderOfPatrolId: x.leaderOfPatrolId,
                leaderOfTroopId: x.leaderOfTroopId,
                assistantOfTroopId: x.assistantOfTroopId,
            }
        }))
    });
    return app;
}