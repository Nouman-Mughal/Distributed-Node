import dgram from 'dgram'
import os from 'os'


const client = dgram.createSocket('udp4');
const host = os.hostname()

const [LS_HOST, LS_PORT] = process.env.LOGSTASH.split(':');
const NODE_ENV = process.env.NODE_ENV

export default function(severity, type, fields) {
    const payload = JSON.stringify({
        '@timestamp': (new Date()).toISOString(),
        "@version": 1, app: 'web-api', environment: NODE_ENV,
        severity, type, fields , host 

    })
    console.log(payload)
    client.send(payload, LS_PORT, LS_HOST)
}