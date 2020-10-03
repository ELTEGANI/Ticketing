import request from 'supertest';
import {app} from '../../app';
import mongoose from 'mongoose'


it('retrun 404 if provided id does not exists',async()=>{
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
          .put(`/api/tickets/${id}`)
          .set('Cookie',global.signin())
          .send({
              title:'title',
              price:20
           })
          .expect(404);
})


it('retrun 401 if the user is not authenticated',async()=>{
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
          .put(`/api/tickets/${id}`)
          .send({
              title:'com',
              price:20
          })
          .expect(401);
})


it('retrun 401 if the user does not own the ticket',async()=>{
   const response = await request(app)
    .post('/api/tickets')
    .set('Cookie',global.signin())
    .send({
        title:'com',price:20
    }) 
    
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',global.signin())
        .send({
            title:'kljklj;',
            price:200
        })
        expect(401)
})


it('retrun 400 if the user provide an invalid price and title',async()=>{
    const cookie = global.signin();
        const response = await request(app)
            .post('/api/tickets')
            .set('Cookie',cookie)
            .send({
                title:'asdas',
                price:20
            })

            await request(app)
            .put(`/api/tickets/${response.body.id}`)
            .set('Cookie',cookie)
            .send({
                title:'',
                price:20
            })    

            expect(400)
            
            
          await request(app)
          .put(`/api/tickets/${response.body.id}`)
          .set('Cookie',cookie)
          .send({
              title:'cc',
              price:-20
          })    
          expect(400)  
})

it('updates the ticket provided valid inputs',async()=>{
    const cookie = global.signin();
    const response = await request(app)
          .post('/api/tickets')
          .set('Cookie',cookie)
          .send({
              title:'asdas',price:20
          })

          await request(app)
                .put(`/api/tickets/${response.body.id}`)
                .set('Cookie',cookie)
                .send({
                    title:'new title',
                    price:20
                })
      
          expect(200);

          const ticketResponse = await request(app)
               .get(`/api/tickets/${response.body.id}`)
               .send();

          expect(ticketResponse.body.title).toEqual('new title')  
          expect(ticketResponse.body.price).toEqual(20)
        })