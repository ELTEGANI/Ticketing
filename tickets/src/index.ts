import mongoose from 'mongoose';
import {app} from './app'
import {natsWrapper} from './nats-wrapper';

const start = async()=>{
  if(!process.env.JWT_KEY){
    throw new Error('JWT KEY must be Configured');
  }
  if(!process.env.MONOG_URI){
    throw new Error('Mongo Uri must be Configured');
  }
  if(!process.env.NATS_CLIENT_ID){
    throw new Error('Mongo Uri must be Configured');
  }
  if(!process.env.NATS_URL){
    throw new Error('Mongo Uri must be Configured');
  }
  if(!process.env.NATS_CLUSTER_ID){
    throw new Error('Mongo Uri must be Configured');
  }
  try{
  await natsWrapper.connect(
    process.env.NATS_CLUSTER_ID,
    process.env.NATS_CLIENT_ID,
    process.env.NATS_URL
    );  
  natsWrapper.client.on('close',()=>{
    console.log('NATS connections closed')
    process.exit();
  });
  process.on('SIGINT',()=>natsWrapper.client.close());
  process.on('SIGTERM',()=>natsWrapper.client.close());
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


