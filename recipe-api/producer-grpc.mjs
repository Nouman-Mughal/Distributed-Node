
import 'dotenv/config';

import grpc from '@grpc/grpc-js';
import loader from '@grpc/proto-loader';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pkg_def = loader.loadSync(__dirname + '/../shared/grpc-recipe.proto');

const recipe = grpc.loadPackageDefinition(pkg_def).recipe;

const server = new grpc.Server();

server.addService(recipe.RecipeService.service, {
    getMetaData:(_call, cb) => {
        cb(null, {
            pid: process.pid
        })
    },

    getRecipe: (call, cb) => {
        if(call.request.id !== 42){
            return cb(new Error(`Unknown Recipe ${call.request.id}`))
        }
        cb(null, {
            id: 42, name: 'Chicken Tikka Masala',
            steps: 'Throw It in a Pot',
            ingredients: [
            {id: 1, name: 'Chicken', quantity: '1 lb'},
            {id: 2, name: 'Sauce', quantity: '2 cups'}
            ]
        })
    }
})
// grpc can use TLS and authentication but for this example its disabled
server.bindAsync(`${process.env.HOST}:${process.env.PORT}`, grpc.ServerCredentials.createInsecure(),(error, port) => {
    if(error) throw error;

    server.start()

    console.log(`Producer running at http://${process.env.HOST}:${process.env.PORT}/`)
})