import Fastify from 'fastify';
import https from 'https'
import axios from 'axios';
import { readFileSync } from 'fs'
import 'dotenv/config';

const server = Fastify()


// creating axios instance using config options with httpsAgent.

// We can add interceptors, use username and password for the communication.    `
    const complex_query = `query KitchenSink ($id:ID){
        recipe(id: $id){
            id name
            ingredients {
                name quantity
            }
        }
        pid
    }`
server.get('/', async () => {
    
  const req = await  axios(`http://127.0.0.1:4000/graphql`,{ // if i put localhost instead of 127.0.0.1 I will get ECONNREFUSED error
        method: 'post',
        headers: {'Content-Type':'Application/json'},
        data: JSON.stringify({
            query: complex_query,
            variables: {id: "42"}
        })
    })
    
  

    return {
        consumer_pid: process.pid,
        producer_data: req.data
    }
    
})

server.listen({port: process.env.PORT, host: process.env.HOST },(error, address)=>{
    error ? console.log(error): console.log(`Consumer running at ${address}`)
   
})

