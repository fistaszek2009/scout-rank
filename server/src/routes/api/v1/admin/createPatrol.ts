import express from 'express'
import { checkSession } from '../../../../utils/session'
import { prisma } from '../../../../lib/prisma'
import { validatePayload, validateName, validateId } from '../../../../utils/validate';

export default function postCreatePatrol(app: express.Application) {
    app.post('/api/v1/admin/createPatrol', async (req, res) => {
        const payload = req.body;
        const payloadValidationRes = validatePayload(payload);
        if (!payloadValidationRes.correct) {
            res.status(payloadValidationRes.statusCode).send('payload: ' + payloadValidationRes.message);
            return;
        }

        const name = payload.name;
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

        const nameValidationRes = validateName(name, true, true);
        if (!nameValidationRes.correct) {
            res.status(nameValidationRes.statusCode).send('name: ' + nameValidationRes.message);
            return;
        }

        const target = await prisma.patrol.findFirst({
            where: {
                name: name,
                troopId: user.event?.troop.id
            }
        });

        if (target) {
            res.status(400).send('name: Patrol with such name already exists!');
            return;
        }
        
        const newPatrol = await prisma.patrol.create({
            data: {
                name: name,
                troopId: user.event?.troop.id!
            }
        });

        res.status(201).json({ id: newPatrol.id });
    });

    return app;
}