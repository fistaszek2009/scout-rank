import express from 'express'
import getUser from './user';
import getPatrol from './patrol';
import getTroop from './troop';
import getEvent from './event';
import getTaskTemplate from './taskTemplate';
import getTask from './task';

export default function addInfoRoute(app: express.Application) {
    getUser(app);
    getPatrol(app);
    getTroop(app);
    getEvent(app);
    getTaskTemplate(app);
    getTask(app);
    return app;
}