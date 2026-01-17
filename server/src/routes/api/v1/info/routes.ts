import express from 'express'
import postUser from './user';
import postPatrol from './patrol';
import postTroop from './troop';
import postEvent from './event';
import postTaskTemplate from './taskTemplate';
import postTask from './task';

export default function addInfoRoute(app: express.Application) {
    postUser(app);
    postPatrol(app);
    postTroop(app);
    postEvent(app);
    postTaskTemplate(app);
    postTask(app);
    return app;
}