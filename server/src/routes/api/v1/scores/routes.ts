import express from 'express'
import postSetUserScore from './setUserScore';
import postSetPatrolScore from './setPatrolScore';

export default function addScoresRoute(app: express.Application) {
    postSetUserScore(app);
    postSetPatrolScore(app);
    return app;
}