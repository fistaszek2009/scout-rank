import express from 'express'
import addAdminRoute from './admin/routes';
import postRegister from './register'
import postLogin from './login';
import getVerifySecretCode from './verifySecretCode';
import getUserInfo from './userInfo';
import getPatrolInfo from './patrolInfo';
import getTroopInfo from './troopInfo';
import getEventInfo from './eventInfo';
import postResetPassword from './resetPassword';

export default function addV1Route(app: express.Application) {
    addAdminRoute(app);
    getVerifySecretCode(app);
    postRegister(app);
    postLogin(app);
    postResetPassword(app);
    getUserInfo(app);
    getPatrolInfo(app);
    getTroopInfo(app);
    getEventInfo(app);
    return app;
}