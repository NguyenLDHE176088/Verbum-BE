import express from 'express';
import 'dotenv/config';
import authRouter from './route/auth-route.js';
import projectRouter from './route/projects.js';
import cors from 'cors'
import cookieParser from 'cookie-parser';


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
app.use('/projects', projectRouter);

const port = process.env.PORT || 8888;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



