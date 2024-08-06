import Fastify from 'fastify';
import axios from 'axios';
import 'dotenv/config';
// import log from './logstash.mjs'
import middie from '@fastify/middie'
import SDC from 'statsd-client';
import v8 from 'v8';
import fs, { stat } from 'fs';

const server = Fastify();

const statsd = new SDC({host: '127.0.0.1', port: 8125,  prefix: 'web-api'} );

(async () => {
    await server.register(middie);
    server.use(statsd.helpers.getExpressMiddleware('inbound', {timeByUrl: true}))
    // server.use((req, res, next) => {
    //   const begin = new Date();
      
    //   req.on('finish', () => {  // A generic middleware that automatically tracks inbound requests.
    //     const responseTime = new Date() - begin;
    //     statsd.timing('inbound.request-time', responseTime);
    //     statsd.increment('inbound.request-count');
    //   });
      
    //   next();
    // });
  
    server.get('/', async () => {
      const begin = new Date();
      const result = await axios.get(`http://127.0.0.1:4000/recipes/42`);
      const responseTime = new Date() - begin;
      
      statsd.timing('outbound.recipe-api.request-time', responseTime);
      statsd.increment('outbound.recipe-api.request-count');
      
      const producerData = await result.data
      
      return { consumer_pid: process.pid, producerData }
    });
  
    server.get('/error', async (req, res) => {
      throw new Error('oh no');
    });
  
    server.listen({port: process.env.PORT, host: process.env.HOST },(error, address)=>{
        console.log(process.env.HOST, "this is hostname")
        if(error) console.log(error)
        console.log(`Consumer running at ${address}`)
    })
  })();

// * this following code will poll the nodejs underbelly every 10 seconds for key information about the process.

  setInterval(() => {
    statsd.gauge('server.conn', server.server._connections);

    const m = process.memoryUsage()
    statsd.gauge('server.memory.used', m.heapUsed)
    statsd.gauge('server.memory.total', m.heapTotal)  // number of connections to server.

    const h = v8.getHeapStatistics()
    statsd.gauge('server.heap.size', h.used_heap_size);
    statsd.gauge('server.heap.limit', h.heap_size_limit);  // process heap utilization

    fs.readdir('/proc/self/fd', (err, list) => {
        if(err) return ;
        statsd.gauge('server.discriptors', list.length)   // open file discreptors ironically using a file descriptors.
    })

    const begin = new Date();

    setTimeout(() => {statsd.timing('eventlag', begin);},0)  // event loop lag
  }, 10_000)






