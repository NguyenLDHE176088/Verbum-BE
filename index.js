import express from 'express';
import 'dotenv/config';
import authRouter from './route/auth-route.js';
import cors from 'cors'
import cookieParser from 'cookie-parser';

import userRouter from './route/user-route.js';

import projectRoute from './route/project-route.js';



const app = express();
app.use(express.json());
app.use(cors(
  {
    origin: 'http://localhost:3000',
    credentials: true
  }
))

app.use(cookieParser());
app.use('/auth', authRouter);
app.use('/users',userRouter);
app.use('/project', projectRoute);

const port = process.env.PORT || 8888;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



