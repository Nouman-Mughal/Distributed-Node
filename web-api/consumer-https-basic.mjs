import Fastify from 'fastify';
import https from 'https'
import axios from 'axios';
import { readFileSync } from 'fs'
import 'dotenv/config';

const server = Fastify()

const agent = new https.Agent({
    ca: readFileSync('../shared/tls/ca-certificate.cert'),
    host: '127.0.0.1', // Use the IPv4 loopback address because IPv6 was giving connection refused errors
    port: 4000 // Specify the port
})

// creating axios instance using config options with httpsAgent.

// We can add interceptors, use username and password for the communication.    `
const instance = axios.create({
    httpsAgent: agent,

})
server.get('/', async () => {
    let producer_data;
    await  instance.get(`https://localhost:4000/recipes/42`)
    .then((Response) => producer_data = Response.data)
    .catch((error) => console.error(error));
  

    return {
        consumer_pid: process.pid,
        producer_data
    }
    
})

server.listen({port: process.env.PORT, host: process.env.HOST },()=>{
    console.log(`Consumer running at http://${process.env.HOST}:${process.env.PORT}`)
})

