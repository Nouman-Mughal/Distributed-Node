import { createServer }  from 'http';

createServer((req, res) => {
    res.end('OK');
}).listen(4000,() => {
    console.log(`Producer running at http://localhost:4000`)
})