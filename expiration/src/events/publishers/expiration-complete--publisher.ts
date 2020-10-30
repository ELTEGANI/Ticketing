import {Subjects,Publisher,ExpirationCompleteEvent} from '@tjtickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
   subject:Subjects.ExpirationComplete = Subjects.ExpirationComplete
}