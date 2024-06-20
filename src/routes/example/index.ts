import { FastifyPluginAsync } from "fastify"

const example: FastifyPluginAsync = async (app, opts): Promise<void> => {
  app.get('/example', async (_request, _reply) => ({ status: true, message: 'OK' }))

  
}

export default example;
