import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import mongoose from 'mongoose';
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
    secure:true
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

const start = async()=>{
  if(!process.env.JWT_KEY){
    throw new Error('JWT KEY must be Configured');
  }
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


