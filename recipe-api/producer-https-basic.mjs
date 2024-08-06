
import Fastify from 'fastify';
import { readFileSync } from 'fs'
// import https from 'https'
import 'dotenv/config';
//* Not as efficient as using reverse proxy.
const server = Fastify({
    https: {
        key: readFileSync('./tls/producer-private-key.key'),
        cert: readFileSync('../shared/tls/producer-certificate.cert')
    },
    logger: true,
    
});


console.log(`worker pid=${process.pid}`)

server.get('/recipes/:id', async (req, reply)=>{
    console.log(`worker request pid=${process.pid}`);

    const id = Number(req.params.id);

    if(id !== 42){
        reply.statusCode = 404
        return {error: 'not_found'}
    }

    return {
        producer_pid: process.pid,
        recipe: {
            id, name: "Chicken Tikka Masala",
            steps: "Throw it in a pot",
            ingredients:[
                {id: 1, name: "Chicken", quantity: "1 lb"},
                {id: 2, name: "Sauce", quantity: "2 cups"}
            ]
        }
    }
})

server.listen({port: process.env.PORT, host: process.env.HOST}, ()=>{
    console.log(`Producer running at https://${process.env.HOST}:${process.env.PORT}`)
})