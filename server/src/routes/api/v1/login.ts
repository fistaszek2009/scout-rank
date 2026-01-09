import express from 'express'
import { validatePayload, validateName, validatePassword, validateId } from '../../../utils/validate'
import { checkPassword } from '../../../utils/password'
import { prisma } from '../../../lib/prisma'
import { startSession } from '../../../utils/session'

export default function postLogin(app: express.Application) {
    app.post('/api/v1/login', async (req, res) => {
        const payload = req.body;
        const payloadValidationRes = validatePayload(payload);
        if (!payloadValidationRes.correct) {
            res.status(payloadValidationRes.statusCode).send('payload: ' + payloadValidationRes.message);
            return;
        }

        const eventId = payload.eventId;
        const firstName = payload.firstName;
        const lastName = payload.lastName;
        const password = payload.password;

        const eventIdValidationRes = validateId(eventId);
        if (!eventIdValidationRes.correct) {
            res.status(eventIdValidationRes.statusCode).send('eventId: ' + eventIdValidationRes.message);
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

        const passwordValidationRes = validatePassword(password);
        if (!passwordValidationRes.correct) {
            res.status(passwordValidationRes.statusCode).send('password:' + passwordValidationRes.message);
            return;
        }

        const event = await prisma.event.findUnique({ where: { id: eventId } });

        if (!event) {
            res.status(400).send('eventId: Event with such id does not exist!');
            return;
        }

        const user = await prisma.user.findFirst({ where: { eventId: eventId, firstName: firstName, lastName: lastName } })

        if (!user) {
            res.status(400).send('credentials: User with such credentials does not exist!');
            return;
        }

        if (!checkPassword(password, user.passwordHash)) {
            res.status(400).send('password: Invalid password!');
            return;
        }

        const sessionSecret = await startSession(user.id);

        res.status(200).json({ userId: user.id, session: sessionSecret });
    });
    return app;
}