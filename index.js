import express from 'express';
import 'dotenv/config';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json' assert { type: 'json' };
import authRouter from './route/auth-route.js';
import jobRouter from './route/job-route.js';
import languageRouter from './route/language-route.js';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import userRouter from './route/user-route.js';
import projectRoute from './route/project-route.js';
import companyRoute from './route/company-route.js';

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
app.use('/languages', languageRouter);
app.use('/users', userRouter);
app.use('/jobs', jobRouter);
app.use('/projects', projectRoute);
app.use('/company', companyRoute)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));







const port = process.env.PORT || 8888;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



