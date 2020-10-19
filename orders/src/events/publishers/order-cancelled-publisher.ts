import {Subjects,Publisher,OrderCancelledEvent} from '@tjtickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject:Subjects.OrderCancelled = Subjects.OrderCancelled
}



