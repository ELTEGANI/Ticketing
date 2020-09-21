import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import cookieSeaaion from 'cookie-session';
import { currenUserRouter } from './routes/current-user';
import { signInRouter } from './routes/siginin';
import { signoutRouter } from './routes/siginout';
import { signUpRouter } from './routes/siginup';
import {errorHandler} from './middlewares/error-handler';
import {NotFoundError} from './errors/not-found-error';

const app = express();
app.set('trust proxy',true);
app.use(json());
app.use(
  cookieSeaaion({
    signed:false,
    secure:process.env.NODE_ENV !=='test'
  })
)

app.use(currenUserRouter);
app.use(signInRouter);
app.use(signoutRouter);
app.use(signUpRouter);
app.use(errorHandler);

app.all('*',async(req,res)=>{
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };