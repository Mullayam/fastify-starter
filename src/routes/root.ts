import { FastifyPluginAsync } from 'fastify'
import example from './example'


const root: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.get('/', async (_request, _reply) => ({ status: true }))
  fastify.get('/health/check', async (_request, _reply) => ({ status: true , message: 'OK'}))
  fastify.register(example,{ prefix: '/api' })
}

export default root