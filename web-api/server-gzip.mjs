import { createGzip } from 'zlib';
import { createReadStream } from 'node:fs';
import http from 'http';

http.createServer((req, res) =>{
    const raw = createReadStream('index.html');
    const acceptEncoding = req.headers['accept-encoding'] || '';
    res.setHeader('Content-Type','text/plain');
    console.log(acceptEncoding)


    if(acceptEncoding.includes('gzip')){
        console.log('encoding with gzip');
        res.setHeader('Content-Encoding','gzip');
        raw.pipe(createGzip()).pipe(res);
    }else {
        console.log('no encoding');
        raw.pipe(res)
    }
}).listen(1337)


//curl http://localhost:1337/ | wc -c // 40 bytes
//curl -H 'Accept-Encoding: gzip' http://localhost:1337/ | wc -c 53 bytes
