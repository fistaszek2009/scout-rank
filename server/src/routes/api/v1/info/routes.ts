import express from 'express'
import getUser from './user';
import getPatrol from './patrol';
import getTroop from './troop';
import getEvent from './event';

export default function addInfoRoute(app: express.Application) {
    getUser(app);
    getPatrol(app);
    getTroop(app);
    getEvent(app);
    return app;
}