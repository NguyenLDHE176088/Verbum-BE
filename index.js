/* global process */
import express from 'express';
import 'dotenv/config';
import authRouter from './route/auth-route.js';


const app = express();
app.use(express.json());

app.use('/auth', authRouter);

const port = process.env.PORT || 8888;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



