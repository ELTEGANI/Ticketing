import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import mongoose from 'mongoose';
import { currenUserRouter } from './routes/current-user';
import { signinRouter } from './routes/sigin';
import { signoutRouter } from './routes/siginout';
import { signUpRouter } from './routes/siginup';
import {errorHandler} from './middlewares/error-handler';
import {NotFoundError} from './errors/not-found-error';

const app = express();
app.use(json());

app.use(currenUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signUpRouter);
app.use(errorHandler);

app.all('*',async(req,res)=>{
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async()=>{
  try{
  await mongoose.connect('mongodb://auth-mongo-srv:27017/auth',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
  });
  console.log('Connected to mongo db');
}catch(err){
   console.error(err);
}
app.listen(3000,()=>{
  console.log("listeng to 3000");
});
};

start();


