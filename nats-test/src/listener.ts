import nats,{Message} from 'node-nats-streaming';
import {randomBytes} from 'crypto';

console.clear();

const stan = nats.connect('ticketing',randomBytes(4).toString('hex'),{
    url:'http://localhost:4222'
});

stan.on('connect',()=>{

    console.log('listener connecting to NATS')

    stan.on('close',()=>{
        console.log('NATS connections closed')
        process.exit();
    })
    const options = stan
       .subscriptionOptions()
       .setManualAckMode(true)
       .setDeliverAllAvailable()//will get all events for the first time
       .setDurableName('order-services')//get all events that need to processed

    const subscription = stan.subscribe('ticket:created','orders-service-queue-group',
    options);

    subscription.on('message',(msg:Message)=>{
        const data = msg.getData();
        if(typeof data === 'string'){
        console.log(`Received Event #${msg.getSequence()}, with data: ${data}`);
        }
        msg.ack();
    });

});

process.on('SIGINT',()=>stan.close());
process.on('SIGTERM',()=>stan.close());