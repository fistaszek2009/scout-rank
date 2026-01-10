import express from 'express'
import dotenv from 'dotenv'
import postRegister from './routes/api/v1/register'
import postLogin from './routes/api/v1/login';
import getVerifySecretCode from './routes/api/v1/verifySecretCode';
import getUserInfo from './routes/api/v1/userInfo';
import getPatrolInfo from './routes/api/v1/patrolInfo';
import getTroopInfo from './routes/api/v1/troopInfo';
import getEventInfo from './routes/api/v1/eventInfo';
import postResetPassword from './routes/api/v1/resetPassword';
import postCreateUser from './routes/api/v1/createUser';
import postCreatePatrol from './routes/api/v1/createPatrol';
import postEditUser from './routes/api/v1/editUser';
import postEditPatrol from './routes/api/v1/editPatrol';
import postEditTroop from './routes/api/v1/editTroop';
import postEditEvent from './routes/api/v1/editEvent';

const PORT = process.env.PORT ?? 3000;
const app = express();

dotenv.config();

app.use(express.json());

getVerifySecretCode(app);
postRegister(app);
postLogin(app);
postResetPassword(app);
getUserInfo(app);
getPatrolInfo(app);
getTroopInfo(app);
getEventInfo(app);
postCreateUser(app);
postCreatePatrol(app);
postEditUser(app);
postEditPatrol(app);
postEditTroop(app);
postEditEvent(app);

app.listen(PORT, () => {
  console.log(`Scout Rank backend listening on ${PORT}`);
});
