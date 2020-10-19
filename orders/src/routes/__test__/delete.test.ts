import request from 'supertest';
import {app} from '../../app';
import {Ticket} from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';
import { Order,OrderStatus } from '../../models/order';


it('marks an order as cancelled',async()=>{
  //create aticket with Ticket order
  const ticket = Ticket.build({
      title:'concert',
      price:10
  })
  await ticket.save();
  const user = global.signin()
  //make request to create an order
  const {body:order} = await request(app)
     .post('/api/orders')
     .set('Cookie',user)
     .send({ticketId:ticket.id})
     .expect(201)

  //make request to cancel the order
  await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie',user)
        .send()
        .expect(204);


  //expectation to make sure the thing is cancelled
  const updateOrder = await Order.findById(order.id);
  expect(updateOrder?.status).toEqual(OrderStatus.Cancelled)
});

it('emits an order cancelled event',async ()=>{
    //create aticket with Ticket order
    const ticket = Ticket.build({
      title:'concert',
      price:10
  })
  await ticket.save();
  const user = global.signin()
  //make request to create an order
  const {body:order} = await request(app)
     .post('/api/orders')
     .set('Cookie',user)
     .send({ticketId:ticket.id})
     .expect(201)

  //make request to cancel the order
  await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie',user)
        .send()
        .expect(204);

        expect(natsWrapper.client.publish).toHaveBeenCalled();
});