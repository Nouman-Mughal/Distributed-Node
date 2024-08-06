import cluster from 'cluster';


console.log(`Master pid=${process.pid}`);

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

cluster.setupPrimary({
    exec: __dirname + '/cluster-fibonacci.mjs'
    // exec: __dirname + '/producer-grpc.mjs'
});

cluster.fork();
cluster.fork();
// cluster.fork();
// cluster.fork();

cluster.on('disconnect', (worker) => {
    console.log('disconnect', worker.id);
})
    .on('exit', (worker, code, signal) => {
        console.log('exit', worker.id, code, signal)
        // cluster.fork() 
        // uncomment above to make workers difficult to kill.In this case only way to kill the children is to kill the master
    })
    .on('listening', (worker, {address, port}) =>{
        console.log('listening', worker.id, `${address}:${port}`)
    })