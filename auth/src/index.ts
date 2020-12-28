import mongoose from 'mongoose';
import {app} from './app'

const start = async()=>{
  console.log('starting log.........');
  if(!process.env.JWT_KEY){
    throw new Error('JWT KEY must be Configured');
  }
  if(!process.env.MONOG_URI){
    throw new Error('MONOG_URI must be Configured');
  }

  try{
  await mongoose.connect(process.env.MONOG_URI,{
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


