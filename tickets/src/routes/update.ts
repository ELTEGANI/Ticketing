import express,{Request,Response} from 'express';
import {NotFoundError,validationRequest,requireAuth,NotAuthorizedError} from '@tjtickets/common';
import {Ticket} from '../models/ticket';
import {body} from 'express-validator';
import {TicketUpdatedPublisher} from '../events/publishers/tiket-updated-publisher';
import {natsWrapper} from '../nats-wrapper';

const router = express.Router();


router.put('/api/tickets/:id',requireAuth,[
     body('title')
    .not()
    .isEmpty()
    .withMessage('Title is required'),
     body('price')
    .isFloat({gt:0})
    .withMessage('Price Must Be Provided and greater than zero')
],validationRequest,async(req:Request,res:Response)=>{
    const ticket = await Ticket.findById(req.params.id);
    if(!ticket){
        throw new NotFoundError();
    }
    if(ticket.userId !== req.currentUser!.id){
        throw new NotAuthorizedError()
    }
    ticket.set({
        title:req.body.title,
        price:req.body.price
    });

    await ticket.save();
    new TicketUpdatedPublisher(natsWrapper.client).publish({
        id:ticket.id,
        title: ticket.title,
        price:ticket.price,
        userId:ticket.userId
    })
    
    res.send(ticket);
}) 


export { router as updateTicketRouter}