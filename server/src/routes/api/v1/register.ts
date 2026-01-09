import express from 'express'
import { validateName, validatePassword, parseAndValidateDate, validatePayload } from '../../../utils/validate'
import { hashPassword } from '../../../utils/password'
import { prisma } from '../../../lib/prisma'


export default function postRegister(app: express.Application) {
    app.post('/api/v1/register', async (req, res) => {
        const payload = req.body;
        const payloadValidationRes = validatePayload(payload);
        if (!payloadValidationRes.correct) {
            res.status(payloadValidationRes.statusCode).send('payload: ' + payloadValidationRes.message);
            return;
        }

        const secretCode = payload.secretCode;

        if (secretCode !== process.env.SECRET_CODE) {
            res.status(401).send('Invalid secret code!');
            return;
        }

        const firstName = payload.firstName;
        const lastName = payload.lastName;

        const password = payload.password;
        const confirmPassword = payload.confirmPassword;

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
        
        if (password !== confirmPassword) {
            res.status(400).send('confirmPassword: Given passwords must be the same!');
            return;
        }

        const troopName = payload.troopName;
        const eventName = payload.eventName;
        const eventStartDateStr = payload.eventStartDate;
        const eventEndDateStr = payload.eventEndDate;

        const troopNameValidationRes = validateName(troopName, true, true);
        if (!troopNameValidationRes.correct) {
            res.status(troopNameValidationRes.statusCode).send('troopName: ' + troopNameValidationRes.message);
            return;
        }

        const eventNameValidationRes = validateName(eventName, true, true);
        if (!eventNameValidationRes.correct) {
            res.status(eventNameValidationRes.statusCode).send('eventName' + eventNameValidationRes.message);
            return;
        }

        const { date: eventStartDate, result: eventStartDateValidationRes } = parseAndValidateDate(eventStartDateStr);
        if (!eventStartDateValidationRes.correct) {
            res.status(eventStartDateValidationRes.statusCode).send('eventStartDate: ' + eventStartDateValidationRes.message);
            return;
        }

        const { date: eventEndDate, result: eventEndDateValidationRes } = parseAndValidateDate(eventEndDateStr);
        if (!eventEndDateValidationRes.correct) {
            res.status(eventEndDateValidationRes.statusCode).send('eventEndDate: ' + eventEndDateValidationRes.message);
            return;
        }
        
        if (eventEndDate < eventStartDate) {
            res.status(400).send('eventEndDate: Start date cannot be later than end date!');
            return;
        }

        const passwordHash = hashPassword(password);

        let troopLeader = await prisma.user.create({
            data: {
                firstName,
                lastName,
                passwordHash
            }
        });

        const troop = await prisma.troop.create({
            data: {
                name: troopName
            }
        });

        const event = await prisma.event.create({
            data: {
                name: eventName,
                startDate: eventStartDate,
                endDate: eventEndDate,
                troopId: troop.id
            }
        });

        troopLeader = await prisma.user.update({ where: { id: troopLeader.id }, data: { eventId: event.id, leaderOfTroopId: troop.id } });

        res.status(201).json({ eventId: event.id });
    });

    return app;
}