import express from 'express'
import { validatePayload, validateId } from '../../../../utils/validate'
import { prisma } from '../../../../lib/prisma'
import { checkSession } from '../../../../utils/session'

export default function getPatrol(app: express.Application) {
    app.get('/api/v1/info/patrol/:patrolId', async (req, res) => {
        const payload = req.body;
        const payloadValidationRes = validatePayload(payload);
        if (!payloadValidationRes.correct) {
            res.status(payloadValidationRes.statusCode).send('payload: ' + payloadValidationRes.message);
            return;
        }

        const userId = payload.userId;
        const patrolId = Number(req.params.patrolId);
        const sessionSecret = payload.sessionSecret;

        const userIdValidationRes = validateId(userId);
        if (!userIdValidationRes.correct) {
            res.status(userIdValidationRes.statusCode).send('userId: ' + userIdValidationRes.message);
            return;
        }

        const patrolIdValidationRes = validateId(patrolId);
        if (!patrolIdValidationRes.correct) {
            res.status(patrolIdValidationRes.statusCode).send('patrolId: ' + patrolIdValidationRes.message);
            return;
        }

        if (!(await checkSession(userId, sessionSecret))) {
            res.sendStatus(401);
            return;
        }

        const user = await prisma.user.findUnique({ where: { id: userId }, include: { event: true } });
        if (!user) {
            res.sendStatus(401);
            return;
        }

        const patrol = await prisma.patrol.findUnique({ where: { id: patrolId }, include: { troop: { include: { event: true } } } });
        if (!patrol) {
            res.sendStatus(400);
            return;
        }

        if (user.eventId !== patrol.troop.event?.id ) {
            res.sendStatus(403);
            return;
        }

        if ((user.assistantOfTroopId || user.leaderOfTroopId) 
            || (user.patrolId == patrolId)) {
            const patrolLeader = await prisma.user.findFirst({ where: { leaderOfPatrolId: patrol.id } });
            const members = await prisma.user.findMany({ where: { patrolId: patrol.id } });

            res.status(200).json({
                id: patrol.id,
                name: patrol.name,
                patrolLeaderId: patrolLeader?.id,
                troopId: patrol.troopId,
                membersIds: members.map((member) => member.id)
            });
            return;
        }

        res.sendStatus(403);
    });
    return app;
}