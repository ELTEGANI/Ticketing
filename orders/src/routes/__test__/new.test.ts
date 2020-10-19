import request from 'supertest';
import {app} from '../../app';
import mongoose from 'mongoose';
import {Order,OrderStatus} from '../../models/order';
import {Ticket} from '../../models/ticket';
import {natsWrapper} from '../../nats-wrapper';

it('returns an error if the ticket doesnt exist',async()=>{
  const ticketId =mongoose.Types.ObjectId()
   await request(app)
         .post('/api/orders')
         .set('Cookie',global.signin())
         .send({ticketId})  
          expect(404);
});

it('returns an error if the ticket already reserved',async()=>{
   const ticket = Ticket.build({
     title:'concert',
     price:10
   })
   await ticket.save();
   const order = Order.build({
     ticket,
     userId:'vvvbbb',
     status:OrderStatus.Created,
     expiresAt:new Date()
   });
   await order.save()
   await request(app)
      .post('/api/orders')
      .set('Cookie',global.signin())
      .send({
        ticketId:ticket.id
      })
      .expect(400);
});


it('reserves ticket',async()=>{
  const ticket = Ticket.build({
    title:'concert',
    price:10
  })
  await ticket.save();
  const res = await request(app)
        .post('/api/orders')
        .set('Cookie',global.signin())
        .send({ticketId:ticket.id})
        .expect(201)
});  

it('emits an order created events',async()=>{
  const ticket = Ticket.build({
    title:'concert',
    price:10
  })
  await ticket.save();
  await request(app)
        .post('/api/orders')
        .set('Cookie',global.signin())
        .send({ticketId:ticket.id})
        .expect(201)
   expect(natsWrapper.client.publish).toHaveBeenCalled();
});