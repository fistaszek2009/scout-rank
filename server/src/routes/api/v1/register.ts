import express from 'express'
import { nameCheck, passwordCheck, dateCheck } from '../../../utils/checks'
import { hashPassword, checkPassword } from '../../../utils/password'
import { prisma } from '../../../lib/prisma'


export default function postRegister(app: express.Application) {
    app.post('/register', async (req, res) => {
        const payload = req.body;
        const secretCode = payload.secretCode;

        if (secretCode !== process.env.SECRET_CODE) {
            res.status(401).send("Invalid secret code!");
        }

        const firstName = payload.firstName;
        const lastName = payload.lastName;

        const password = payload.password;
        const confirmPassword = payload.confirmPassword;

        const firstNameCheckRes = nameCheck(firstName);
        if (!firstNameCheckRes.correct) {
            res.status(firstNameCheckRes.statusCode).send(firstNameCheckRes.message);
            return;
        }

        const lastNameCheckRes = nameCheck(lastName);
        if (!lastNameCheckRes.correct) {
            res.status(lastNameCheckRes.statusCode).send(lastNameCheckRes.message);
            return;
        }

        const passwordCheckRes = passwordCheck(password);
        if (!passwordCheckRes.correct) {
            res.status(passwordCheckRes.statusCode).send(passwordCheckRes.message);
            return;
        }
        
        if (password !== confirmPassword) {
            res.status(400).send("Given passwords must be the same!");
            return;
        }

        const troopName = payload.troopName;
        const eventName = payload.eventName;
        const eventStartDate = payload.eventStartDate;
        const eventEndDate = payload.eventEndDate;

        const troopNameCheckRes = nameCheck(troopName, true, true);
        if (!troopNameCheckRes.correct) {
            res.status(troopNameCheckRes.statusCode).send(troopNameCheckRes.message);
            return;
        }

        const eventNameCheckRes = nameCheck(eventName, true, true);
        if (!eventNameCheckRes.correct) {
            res.status(eventNameCheckRes.statusCode).send(eventNameCheckRes.message);
            return;
        }

        const eventStartDateCheckRes = dateCheck(eventStartDate)
        if (!eventStartDateCheckRes.correct) {
            res.status(eventStartDateCheckRes.statusCode).send(eventStartDateCheckRes.message);
            return;
        }

        const eventEndDateCheckRes = dateCheck(eventEndDate)
        if (!eventEndDateCheckRes.correct) {
            res.status(eventEndDateCheckRes.statusCode).send(eventEndDateCheckRes.message);
            return;
        }
        
        if (eventEndDate < eventStartDate) {
            res.status(400).send("End date cannot be later than start date!");
            return;
        }

        const passwordHash = hashPassword(password)

        const troopLeader = await prisma.user.create({
            data: {
                firstName,
                lastName,
                passwordHash
            }
        })

        const troop = await prisma.troop.create({
            data: {
                name: troopName,
                leaderId: troopLeader.id
            }
        })

        const event = await prisma.event.create({
            data: {
                name: eventName,
                startDate: eventStartDate,
                endDate: eventEndDate,
                troopId: troop.id
            }
        })

        res.sendStatus(200);
    });

    return app;
}