import {Listener,OrderCreatedEvent,Subjects} from '@tjtickets/common';
import {queueGroupName} from './queue-group-name';
import { Message } from 'node-nats-streaming';
import {expirationQueue} from '../../queues/expiration-queue';


export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
   subject:Subjects.OrderCreated = Subjects.OrderCreated;
   queueGroupName = queueGroupName;

   async onMessage(data:OrderCreatedEvent['data'],msg:Message){
      const delay = new Date(data.expiresAt).getTime() - new Date().getTime()
      console.log('waiting this millisecounds to process a job',delay);
       await expirationQueue.add({
          orderId:data.id
       },
      //  {
      //     delay:10000
      //  }
       );
       msg.ack();
   }
}
