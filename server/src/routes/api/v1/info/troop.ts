import express from 'express'
import { validatePayload, validateId } from '../../../../utils/validate'
import { prisma } from '../../../../lib/prisma'
import { checkSession } from '../../../../utils/session'

export default function getTroop(app: express.Application) {
    app.get('/api/v1/info/troop/:troopId', async (req, res) => {
        const payload = req.body;
        const payloadValidationRes = validatePayload(payload);
        if (!payloadValidationRes.correct) {
            res.status(payloadValidationRes.statusCode).send('payload: ' + payloadValidationRes.message);
            return;
        }

        const userId = payload.userId;
        const troopId = Number(req.params.troopId);
        const sessionSecret = payload.sessionSecret;

        const userIdValidationRes = validateId(userId);
        if (!userIdValidationRes.correct) {
            res.status(userIdValidationRes.statusCode).send('userId: ' + userIdValidationRes.message);
            return;
        }

        const troopIdValidationRes = validateId(troopId);
        if (!troopIdValidationRes.correct) {
            res.status(troopIdValidationRes.statusCode).send('troopId: ' + troopIdValidationRes.message);
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

        const troop = await prisma.troop.findUnique({ where: { id: troopId }, include: { event: true } });
        if (!troop) {
            res.sendStatus(400);
            return;
        }

        if (user.eventId !== troop.event?.id ) {
            res.sendStatus(403);
            return;
        }

        const troopLeader = await prisma.user.findFirst({ where: { leaderOfTroopId: troopId } });
        const patrols = await prisma.patrol.findMany({ where: { troopId: troop.id } });
        const assistants = await prisma.user.findMany({ where: { assistantOfTroopId: troop.id } });

        res.status(200).json({
            id: troop.id,
            name: troop.name,
            troopLeaderId: troopLeader?.id,
            troopAssistantsIds: assistants.map((assistant) => assistant.id),
            patrolsIds: patrols.map((patrol) => patrol.id)
        });
    });
    return app;
}