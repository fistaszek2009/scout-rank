import express from 'express'
import addAdminRoute from './admin/routes';
import addInfoRoute from './info/routes';
import addAccountRoute from './account/routes';
import addScoresRoute from './scores/routes';
import postRegister from './register'
import postLogin from './login';
import postVerifySecretCode from './verifySecretCode';

export default function addV1Route(app: express.Application) {
    addAdminRoute(app);
    addInfoRoute(app);
    addAccountRoute(app);
    addScoresRoute(app);
    postVerifySecretCode(app);
    postRegister(app);
    postLogin(app);
    return app;
}