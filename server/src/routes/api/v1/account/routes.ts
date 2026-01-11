import express from 'express'
import postResetPassword from './resetPassword';

export default function addAccountRoute(app: express.Application) {
    postResetPassword(app);
    return app;
}