import Fastify from 'fastify';
import axios from 'axios';
import 'dotenv/config';
import log from './logstash.mjs'
import middie from '@fastify/middie'

const server = Fastify();

( async () => {
    await server.register(middie)
    server.use((req, res, next) => {
        log('info', `request-incoming`, {
            path: req.url, method: req.method, ip: req.ip,
            ua:req.headers[`user-agent`] || null
        })
        next()
    })

    server.setErrorHandler(async (error, req) => {
        log('error', 'request-failure', {
            stack: error.stack, 
            path: req.url, 
            method: req.method,

        })
        return {error: error.message}
    })

    server.get('/', async () => {
        const url = `http://127.0.0.1:4000/recipes/42`
        log('info', 'request-outgoing', {url, svc: 'recipe-api'})
        const res = await  axios.get(url)
        const producer_data = res.data;
      
        return {
            consumer_pid: process.pid,
            producer_data
        }
    
    })
        

    server.get('/error', async () => {throw new Error('oh no')})

    server.listen({port: process.env.PORT, host: process.env.HOST },(error, address)=>{
        log('verbose', 'listen', {address})
    })
})();






