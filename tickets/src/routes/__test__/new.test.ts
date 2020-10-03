import request from 'supertest';
import {app} from '../../app';
import { Ticket } from '../../models/ticket';


it('has route handler listening to /api/tickest for posts request',async() => {
    const response = await request(app)
         .post('/api/tickets')
         .send({});
    expect(response.status).not.toEqual(404);     
})

it('can only access it if user can sigined in ',async() => {
  await request(app)
    .post('/api/tickets')
    .send({});
    expect(401);   
})


it('returns status other than 401 if the user is signed in',async() => {
  const response = await request(app)
  .post('/api/tickets')
  .set('Cookie',global.signin())
  .send({});
expect(response.status).not.toEqual(401);  
})

it('returns an error if an invalid title is provided',async() => {
await request(app)
  .post('/api/tickets')
  .set('Cookie',global.signin())
  .send({
    price:10
  });
expect(400);  
await request(app)
  .post('/api/tickets')
  .set('Cookie',global.signin())
  .send({
    title:'',
    price:10
  });
expect(400);  
})


it('returns an error if an invalid price is provided',async() => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie',global.signin())
    .send({
      title:'ddfdfd',
      price:-10
    });
  expect(400);  
  await request(app)
    .post('/api/tickets')
    .set('Cookie',global.signin())
    .send({
      title:'dsdfsd',
    });
  expect(400);  
  })

  it('creates a tickets with valid inputs',async() => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);
  const title= 'wrwer';
  await request(app)
    .post('/api/tickets')
    .set('Cookie',global.signin())
    .send({
      title:'wrwer',
      price:70
    });
  expect(201);  
  tickets = await Ticket.find({})
  expect(tickets.length).toEqual(1)
  expect(tickets[0].price).toEqual(70)
  expect(tickets[0].title).toEqual(title)
  })


