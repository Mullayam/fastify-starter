import fp from 'fastify-plugin'

import type { FastifyCorsOptions } from '@fastify/cors'
import cors from '@fastify/cors'

export default fp<FastifyCorsOptions>(async (fastify, opts) => {
    await fastify.register(cors, {
        allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        origin: true,
        logLevel: 'warn',
    })
})