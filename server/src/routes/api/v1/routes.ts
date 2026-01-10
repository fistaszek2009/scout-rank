import express from 'express'
import addAdminRoute from './admin/routes';
import addInfoRoute from './info/routes';
import postRegister from './register'
import postLogin from './login';
import getVerifySecretCode from './verifySecretCode';
import postResetPassword from './resetPassword';

export default function addV1Route(app: express.Application) {
    addAdminRoute(app);
    addInfoRoute(app);
    getVerifySecretCode(app);
    postRegister(app);
    postLogin(app);
    postResetPassword(app);
    return app;
}