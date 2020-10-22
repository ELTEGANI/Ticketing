import {Ticket} from '../ticket';

it('implements optimistic concurrency control',async(done)=>{
 //create at ticket
  const ticket = Ticket.build({
      title:'concert',
      price:10,
      userId:'123'
  });
//save ticket to database
await ticket.save();


//fetch the ticket twice
const firstInstance = await Ticket.findById(ticket.id);
const secoundInstance = await Ticket.findById(ticket.id);

//make two separate changes to this tickets we fetched
firstInstance?.set({price:10});
secoundInstance?.set({price:15});

//save the first
await firstInstance?.save();

//save the secound expected an error
try{
await secoundInstance?.save()
}catch(err){
    return done();
}
throw new Error('should not reach this');;
});


it('increments the version number on multiple saves',async()=>{
  const ticket = Ticket.build({
      title:'concert',
      price:10,
      userId:'123'
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
})