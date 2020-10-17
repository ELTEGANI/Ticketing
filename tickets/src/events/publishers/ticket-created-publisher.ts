import {Publisher,Subjects,TicketCreatedEvent} from '@tjtickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject:Subjects.TicketCreated = Subjects.TicketCreated;
}