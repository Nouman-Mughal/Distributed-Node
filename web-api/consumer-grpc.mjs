import util from 'util';
import grpc from '@grpc/grpc-js';
import fastify from 'fastify';
import loader from '@grpc/proto-loader';
import 'dotenv/config';

import { fileURLToPath } from 'url';
import { dirname } from 'path';


const server = fastify();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pkg_def = loader.loadSync(__dirname + '/../shared/grpc-recipe.proto');

const recipe = grpc.loadPackageDefinition(pkg_def).recipe;

const client = new recipe.RecipeService(
    process.env.TARGET,
    grpc.credentials.createInsecure()
);

const getMetaData = util.promisify(client.getMetaData.bind(client));
const getRecipe = util.promisify(client.getRecipe.bind(client));

server.get('/', async () => {
    const [meta, recipe] = await Promise.all([
        getMetaData({}),
        getRecipe({id: 42})
    ])

    return {
        consumer_pid: process.pid,
        producer_data: meta,
        recipe
    }

})

server.listen({port: process.env.PORT, host: process.env.HOST}, () => {
    console.log(`Consumer running at http://${process.env.HOST}:${process.env.PORT}`)
})
