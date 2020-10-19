import {Publisher,OrderCreatedEvent,Subjects} from '@tjtickets/common';


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
  subject:Subjects.OrderCreated  = Subjects.OrderCreated
}