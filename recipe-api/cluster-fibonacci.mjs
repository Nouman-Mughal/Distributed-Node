import fastify from 'fastify';
import 'dotenv/config'
const server = fastify();

console.log(`worker pid = ${process.pid}`)

server.get('/:limit', async (req, reply) => {
    // going to simulate slow database connection
    await sleep(10)
    return String(fibonacci(Number(req.params.limit)))
})

server.listen({host: process.env.HOST, port: process.env.PORT}, (err, address) => {
    if(err) console.log(err)
    console.log(`Producer running at ${address}`)
})
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function fibonacci (limit) {
    let prev = 1n , next = 0n, swap;
    while(limit) {
        swap = prev;
        prev = prev + next;
        next = swap;
        limit--
    }
    return next;
}