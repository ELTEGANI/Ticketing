import {Subjects,Publisher,PaymentCreatedEvent}
from '@tjtickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
   subject:Subjects.PaymentCreated = Subjects.PaymentCreated;
}