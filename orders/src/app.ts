import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import cookieSession from 'cookie-session';
import {errorHandler,NotFoundError,currentUser} from '@tjtickets/common';
import {deleteOrderRouter} from './routes/delete';
import {newOrderRouter} from './routes/new';
import {showOderRouter} from './routes/show';
import {indexOrderRouter} from './routes/index';
  
const app = express();
app.set('trust proxy',true); 
app.use(json());
app.use(
  cookieSession({
    signed:false,
    secure:process.env.NODE_ENV !== 'test'
  })
)
app.use(currentUser);
app.use(deleteOrderRouter);
app.use(newOrderRouter);
app.use(showOderRouter);
app.use(indexOrderRouter);

app.all('*',async(req,res)=>{
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };