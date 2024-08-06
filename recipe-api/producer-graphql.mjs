
import Fastify from 'fastify';
import { readFileSync } from 'fs'
// import https from 'https'
import mercurius from 'mercurius';
import 'dotenv/config';
//* Not as efficient as using reverse proxy.
const server = Fastify()


const schema = readFileSync('../shared/graphql-schema.gql').toString();


const resolvers = {
    Query: {
        pid: () => process.pid,
        recipe: async (_obj, {id}) => {
            if(id != 42) throw new Error(`recipe ${id} nto found`);
            return {
                id, name: 'Chicken Tikka Masala',
                steps: 'Throw It in a Pot'
            }
        }
    },
    Recipe:{
        ingredients: async (obj) => {
            return (obj.id != 42) ? [] : [
                {id: 1, name: 'Chicken', quantity: '1 lb'},
                {id: 2 , name: 'Sauce', quantity: '2 cups'}
            ]
        }
    }
}
server.register(mercurius, {
    schema, resolvers, graphiql: true
}).listen({port: process.env.PORT, host: process.env.HOST}, (error, address) => {
   
    error ? console.log(error) : console.log(`Producer running at ${address}/graphiql`)
})

// server.listen({port: process.env.PORT, host: process.env.HOST}, ()=>{
//     console.log(`Producer running at http://${process.env.HOST}:${process.env.PORT}/graphiql`)
// })