import  request from 'supertest';
import  {app}  from '../../app';


it('returns a 400 on worng email address',async()=> {
    return request(app)
        .post('/api/users/signin')
        .send({
            email:'testtest.com',
            password:'333'
        })
        .expect(400);
});

it('returns a 400 on worng password',async()=> {
    return request(app)
        .post('/api/users/signin')
        .send({
            email:'test@test.com',
            password:'3'
        })
        .expect(400);
});

it('fails when email that does not exists is supplied',async()=> {
    await request(app)
        .post('/api/users/signin')
        .send({
            email:'test@test.com',
            password:'password'
        })
        .expect(400);
});

it('fails when an incorrect password is supplied',async()=> {
    await request(app)
        .post('/api/users/signup')
        .send({
            email:'test@test.com',
            password:'password'
        })
        .expect(201);

        await request(app)
        .post('/api/users/signin')
        .send({
            email:'test@test.com',
            password:'cccc'
        })
        .expect(400);    
});


it('it responds with cookie when given valid credentials',async()=> {
    await request(app)
        .post('/api/users/signup')
        .send({
            email:'test@test.com',
            password:'password'
        })
        .expect(201);

    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email:'test@test.com',
            password:'password'
        })
        .expect(200);    
        expect(response.get('Set-Cookie')).toBeDefined();
});