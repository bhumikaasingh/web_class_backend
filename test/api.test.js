

//for sending request
const request = require('supertest')

//server main file(index.js)
const app = require('../index')
const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Nzg0ZmIwN2NjYTY5ZWY3ZGU1NDVmYiIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE3MTkxNjA3Njh9.ev-8PkGf2s1mcpOD80X22yhr5rZw3AVom-_69d68L8w"


//making test collection
describe('Api Test Collection', () => {
    // test case 1(/test)

    it('GET /test| Response test',async()=>{

        //making api request to /test
        const response=await request(app).get ('/test');

        //our response should have 200 status code 
        expect(response.statusCode).toBe(200)

        //expect text
        expect(response.text).toEqual('Test Api is Working...!')
    });
    // it('GET Products| Fetch all products',async()=>{
    //     const response=(await request(app).get('/api/product/get_all_products')).set('authorization',`Bearer ${token}`);

    //     // expect(response.statusCode).toBe(200)

    //     // expect(response.body).toBeDefined();

    //     expect(response.body.message).toEqual('product fetched ');
    // })
    
    it('GET Products | Fetch all products', async () => {
        const response = await request(app).get('/api/product/get_all_products').set('authorization', `Bearer ${token}`);
        // expect(response.statusCode).toBe(200);
        // expect(response.body.sucess).toBe(true);
        // expect(response.body).toBeDefined();
        expect(response.body.message).toEqual('product fetched successfully');
    })


    //register api(post)

    it('POST /api/user/create | Response with message',async()=>{

        const response=await request(app).post('/api/user/create').send({
            'firstName':"bhumika ",
            "lastName":"Singh",
            "email":"bhumi@gmail.com",
            "password":"123"
        });
        // if already exists
        if(!response.body.success){
            expect(response.body.message).toEqual('User Already Exists!')
        }else{
            expect(response.statusCode).toBe(200)
        expect(response.body.message).toEqual('User Created Successfully')

        }
        
    })


    //task 
    //login
    //update product(try)
  
})

