
import Fastify from 'fastify';
import 'dotenv/config';
import Zipkin from 'zipkin-lite';
const server = Fastify();

const zipkin = new Zipkin({
    zipkinHost: process.env.ZIPKIN,
    serviceName: 'recipe-api',
    servicePort: process.env.PORT
})

server.addHook('onRequest', zipkin.onRequest());
server.addHook('onResponse', zipkin.onResponse())

console.log(`worker pid=${process.pid}`)

server.get('/recipes/:id', async (req, reply)=>{
    // console.log(`worker request pid=${process.pid}`);
    req.zipkin.setName('get_recipe')
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

server.listen({port: process.env.PORT, host: process.env.HOST}, (error, address)=>{
    if(error) console.log(error);
    console.log(`Producer running at ${address}`)
})

/**
 * this Service doesnt act as root service, So the init config flag has been omitted.If it receives a request 
 * directly,it wont generate a traceID, unlike the web-api service.
 * Also Note that req.zipkin.prepare() method is available in the new recipe-api service even though example not using
 * it. When implementing zipkin within services you own, you'll want to pass the Zipkin Header to as many upstream service
 * as you can.
 */