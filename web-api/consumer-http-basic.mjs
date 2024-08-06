import Fastify from 'fastify';
import axios from 'axios';
import 'dotenv/config';

const server = Fastify()

server.get('/', async () => {
    let producer_data;
    await  axios.get(`http://127.0.0.1:4000/recipes/42`)
    .then((Response) => producer_data = Response.data)
    .catch((error) => console.error(error));
  

    return {
        consumer_pid: process.pid,
        producer_data
    }
    
})


server.listen({port: process.env.PORT, host: process.env.HOST },(error, address)=>{
    if(error) console.log(error)
    console.log(`Consumer running at ${address}`)
})

