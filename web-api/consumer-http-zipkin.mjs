import Fastify from 'fastify';
import axios from 'axios';
import 'dotenv/config';
import Zipkin from 'zipkin-lite';
const server = Fastify()
// Zipkin-lite works only with fastify and not good for production. go see NPM ZipKin for Production.
const zipkin = new Zipkin({
    zipkinHost: process.env.ZIPKIN,
    serviceName: 'web-api', servicePort: process.env.PORT , serviceIp: process.env.HOST, 
     init: 'short' // web-api accept outside request and can generate trace IDs.
    /**
     * The init value can be set to long to use 32 character IDs,
     * short to use 16 character IDs, or false to be disabled entirely. true is an alias for short.
     */
})

server.addHook('onRequest', zipkin.onRequest());
server.addHook('onResponse', zipkin.onResponse());
/**
 * Hooks are called when request start and finish.
 * The onRequest and onResponse hooks are required to extend the req object, and to capture and report the timing information for 
 * the incoming request. The incoming request object is modified to have an added property, available at req.zipkin. This object has the following shape:
 * {
  // The start time of the request with pseudo-microsecond precision
  start: 1579463188658000,
 
  // The incoming Zipkin-related headers (you shouldn't need these)
  headers: {
    traceId: '64273ad10379e27f6ef33242096297fc',
    spanId: 'aba861e477551efc',
    parentSpanId: '936313062d7e3496',
    sampled: '0',
    flags: undefined
  },
 
  // Whether this is a debug request (if so, increase logging verbosity)
  debug: false,
 
  // Whether this request is being sent to the Zipkin server
  sampled: false,
 
  // The Trace ID for this and related requests. Use it in log messages for grouping
  trace: '64273ad10379e27f6ef33242096297fc',
 
  // Set the "name" of an endpoint, like "GET /widget/:id" could be "get_widget"
  setName(name),
 
  // A method to prepare a new outgoing request. Call once for each outgoing request.
  prepare()
}
 */
server.get('/', async (req) => {
   req.zipkin.setName('get_root') // Each endPoint need to specify its Name.
   
   const url = 'http://127.0.0.1:4000/recipes/42';
   const z_req = req.zipkin.prepare() // outbound requests are manually instrumented.
   const recipe = await axios.get(url, {headers: z_req.headers })
   z_req.complete(`GET`, url);

    const producer_data = recipe.data;


    return {
        pid: process.pid,
        producer_data, 
        trace: req.zipkin.trace
    }

    
})

server.listen({port: process.env.PORT, host: process.env.HOST },(error, address)=>{
    if(error) console.log(error)
    console.log(`Consumer running at ${address}`)
})

