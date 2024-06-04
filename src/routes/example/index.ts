import { FastifyPluginAsync } from "fastify"

const example: FastifyPluginAsync = async (app, opts): Promise<void> => {
  app.get('/', async function (request, reply) {
    return 'this is an example'
  })
}

export default example;
