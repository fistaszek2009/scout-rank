import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import addV1Route from './routes/api/v1/routes';

const PORT = process.env.PORT ?? 3000;
const app = express();

dotenv.config();

app.use(express.json());
app.use(cors());

addV1Route(app);

app.listen(PORT, () => {
  console.log(`Scout Rank backend listening on ${PORT}`);
});
