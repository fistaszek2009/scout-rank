import express from 'express'
import postCreateUser from './createUser';
import postCreatePatrol from './createPatrol';
import postEditUser from './editUser';
import postEditPatrol from './editPatrol';
import postEditTroop from './editTroop';
import postEditEvent from './editEvent';

export default function addAdminRoute(app: express.Application) {
    postCreateUser(app);
    postCreatePatrol(app);
    postEditUser(app);
    postEditPatrol(app);
    postEditTroop(app);
    postEditEvent(app);
    return app;
}