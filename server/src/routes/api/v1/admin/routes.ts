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
import postEditTaskTemplate from './editTaskTemplate';
import postEditTask from './editTask';
import postDeleteTaskTemplate from './deleteTaskTemplate';
import postDeleteTask from './deleteTask';

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
    postEditTaskTemplate(app);
    postEditTask(app);
    postDeleteTaskTemplate(app);
    postDeleteTask(app);
    return app;
}