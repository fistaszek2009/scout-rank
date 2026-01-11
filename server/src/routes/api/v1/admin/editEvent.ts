import express from 'express'
import { checkSession } from '../../../../utils/session'
import { prisma } from '../../../../lib/prisma'
import { validatePayload, validateName, validateId, parseAndValidateDate } from '../../../../utils/validate';

export default function postEditEvent(app: express.Application) {
    app.post('/api/v1/admin/editEvent/:targetId', async (req, res) => {
        const payload = req.body;
        const payloadValidationRes = validatePayload(payload);
        if (!payloadValidationRes.correct) {
            res.status(payloadValidationRes.statusCode).send('payload: ' + payloadValidationRes.message);
            return;
        }

        const targetId = Number(req.params.targetId);
        const name = payload.name;
        const startDateStr = payload.startDate;
        const endDateStr = payload.endDate;
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

        const nameValidationRes = validateName(name, true, true);
        if (!nameValidationRes.correct) {
            res.status(nameValidationRes.statusCode).send('name: ' + nameValidationRes.message);
            return;
        }

        const { date: startDate, result: startDateValidationRes } = parseAndValidateDate(startDateStr);
        if (!startDateValidationRes.correct) {
            res.status(startDateValidationRes.statusCode).send('startDate: ' + startDateValidationRes.message);
            return;
        }

        const { date: endDate, result: endDateValidationRes } = parseAndValidateDate(endDateStr);
        if (!endDateValidationRes.correct) {
            res.status(endDateValidationRes.statusCode).send('endDate: ' + endDateValidationRes.message);
            return;
        }

        if (endDate < startDate) {
            res.status(400).send('eventEndDate: Start date cannot be later than end date!');
            return;
        }

        const target = await prisma.event.findUnique({ where: { id: targetId } });
        if (!target) {
            res.sendStatus(400);
            return;
        }

        if (target.id !== user.eventId) {
            res.sendStatus(403);
            return;
        }

        const updatedTarget = await prisma.event.update({
            where: {
                id: target.id
            },
            data: {
                name: name,
                startDate: startDate,
                endDate: endDate
            }
        });

        res.sendStatus(200);
    });

    return app;
}