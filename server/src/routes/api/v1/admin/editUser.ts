import express from 'express'
import { checkSession } from '../../../../utils/session'
import { prisma } from '../../../../lib/prisma'
import { validatePayload, validateName, validateId, validateBoolean } from '../../../../utils/validate';

export default function postEditUser(app: express.Application) {
    app.post('/api/v1/admin/editUser/:targetId', async (req, res) => {
        const payload = req.body;
        const payloadValidationRes = validatePayload(payload);
        if (!payloadValidationRes.correct) {
            res.status(payloadValidationRes.statusCode).send('payload: ' + payloadValidationRes.message);
            return;
        }

        const targetId = Number(req.params.targetId);
        const firstName = payload.firstName;
        const lastName = payload.lastName;
        const patrolId = payload.patrolId;
        const isLeaderOfPatrol = payload.isLeaderOfPatrol;
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

        const firstNameValidationRes = validateName(firstName);
        if (!firstNameValidationRes.correct) {
            res.status(firstNameValidationRes.statusCode).send('firstName: ' + firstNameValidationRes.message);
            return;
        }

        const lastNameValidationRes = validateName(lastName);
        if (!lastNameValidationRes.correct) {
            res.status(lastNameValidationRes.statusCode).send('lastName: ' + lastNameValidationRes.message);
            return;
        }

        const target = await prisma.user.findUnique({ where: { id: targetId }, include: { event: { include: { troop: true } } } });
        if (!target) {
            res.sendStatus(401);
            return;
        }

        if (target.eventId !== user.eventId) {
            res.sendStatus(403);
            return;
        }
        
        if (target.assistantOfTroopId) {
            const newTarget = await prisma.user.findFirst({
                where: {
                    firstName: firstName,
                    lastName: lastName,
                    eventId: user.eventId
                }
            });

            if (newTarget) {
                res.status(400).send('credentials: User with such credentials already exists!');
                return;
            }

            const updatedTarget = await prisma.user.update({
                where: {
                    id: target.id
                },
                data: {
                    firstName: firstName,
                    lastName: lastName
                }
            });

            res.sendStatus(200);
            return;
        }

        const patrolIdValidationRes = validateId(patrolId);
        if (!patrolIdValidationRes.correct) {
            res.status(patrolIdValidationRes.statusCode).send('patrolId: ' + patrolIdValidationRes.message);
            return;
        }

        const patrol = await prisma.patrol.findUnique({ where: { id: patrolId } });
        if (!patrol) {
            res.sendStatus(400);
            return;
        }

        if (user.event?.troopId !== patrol.troopId) {
            res.sendStatus(403);
            return;
        }

        const isLeaderOfPatrolValidationRes = validateBoolean(isLeaderOfPatrol);
        if (!isLeaderOfPatrolValidationRes.correct) {
            res.status(isLeaderOfPatrolValidationRes.statusCode).send('isLeaderOfPatrol: ' + isLeaderOfPatrolValidationRes.message);
            return;
        }

        const leaderOfPatrol = await prisma.user.findFirst({
            where: {
                leaderOfPatrolId: patrol.id
            }
        });

        if (leaderOfPatrol && isLeaderOfPatrol) {
            res.status(400).send('isLeaderOfPatrol: This patrol already has leader!');
            return;
        }
        
        const newTarget = await prisma.user.findFirst({
            where: {
                firstName: firstName,
                lastName: lastName,
                eventId: user.eventId
            }
        });

        if (newTarget) {
            res.status(400).send('credentials: User with such credentials already exists!');
            return;
        }

        const updatedTarget = await prisma.user.update({
            where: {
                id: target.id
            },
            data: {
                firstName: firstName,
                lastName: lastName,
                patrolId: patrolId,
                leaderOfPatrolId: isLeaderOfPatrol ? patrolId : null
            }
        });

        res.sendStatus(200);
    });

    return app;
}