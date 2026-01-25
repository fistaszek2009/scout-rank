import express from 'express'
import postInPatrol from './inPatrol'
import postGlobal from './global';
import postPatrols from './patrols';

export default function addStatsRoute(app: express.Application) {
    postInPatrol(app);
    postGlobal(app);
    postPatrols(app);
    return app;
}