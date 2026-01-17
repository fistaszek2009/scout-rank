import express from 'express'
import { validatePayload } from '../../../utils/validate';
import { checkSession } from '../../../utils/session'

export default function postVerifySession(app: express.Application) {
    app.post('/api/v1/verifySession', async (req, res) => {
        const payload = req.body;
        const payloadValidationRes = validatePayload(payload);
        if (!payloadValidationRes.correct) {
            res.status(payloadValidationRes.statusCode).send('payload: ' + payloadValidationRes.message);
            return;
        }

        const userId = payload.userId;
        const sessionSecret = payload.sessionSecret;

        if (!checkSession(userId, sessionSecret)) {
            res.status(401).send('Invalid or expired session!');
            return;
        }

        res.sendStatus(200);
    });

    return app;
}