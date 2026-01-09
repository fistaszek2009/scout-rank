import express from 'express'
import { validatePayload } from '../../../utils/validate';

export default function getVerifySecretCode(app: express.Application) {
    app.get('/api/v1/verifySecretCode', async (req, res) => {
        const payload = req.body;
        const secretCode = payload.secretCode;
        const payloadValidationRes = validatePayload(payload);
        if (!payloadValidationRes.correct) {
            res.status(payloadValidationRes.statusCode).send('payload: ' + payloadValidationRes.message);
            return;
        }

        if (secretCode !== process.env.SECRET_CODE) {
            res.status(401).send('Invalid secret code!');
            return;
        }

        res.sendStatus(200);
    });

    return app;
}