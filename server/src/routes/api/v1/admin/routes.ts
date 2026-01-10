import express from 'express'
import postCreateUser from './createUser';
import postCreatePatrol from './createPatrol';
import postEditUser from './editUser';
import postEditPatrol from './editPatrol';
import postEditTroop from './editTroop';
import postEditEvent from './editEvent';
import postDeleteUser from './deleteUser';
import postDeletePatrol from './deletePatrol';
import postDeleteEvent from './deleteEvent';
import postCreateTaskTemplate from './createTaskTemplate';
import postCreateTask from './createTask';

export default function addAdminRoute(app: express.Application) {
    postCreateUser(app);
    postCreatePatrol(app);
    postEditUser(app);
    postEditPatrol(app);
    postEditTroop(app);
    postEditEvent(app);
    postDeleteUser(app);
    postDeletePatrol(app);
    postDeleteEvent(app);
    postCreateTaskTemplate(app);
    postCreateTask(app);
    return app;
}