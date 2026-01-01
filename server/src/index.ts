import express from 'express'
import dotenv from 'dotenv'
import postRegister from './routes/api/v1/register'

const PORT = 3000;
const app = express();

dotenv.config();

app.use(express.json());

postRegister(app)

/*
- register (email/username, password, secretCode)
- login (email/username, password)
- resetPassword (targetUser, username, sessionSecret)
- fetchUserData (targetUser, username, sessionSecret)
...
- updateUserData (targetUser, data, timestamp, username, sessionSecret)
- updateGroupData (targetGroup, data, timestamp, username, sessionSecret)
*/

app.listen(PORT, () => {
  console.log(`Scout Rank backend listening on ${PORT}`);
});
