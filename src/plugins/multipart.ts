import fp from 'fastify-plugin'
import {Unauthorized} from 'http-errors'
import type { FastifyMultipartOptions } from '@fastify/multipart'
 
// https://github.com/arkerone/fastify-api-key
export default fp<FastifyMultipartOptions>(async (fastify, _opts) => {
  fastify.register(require('fastify-api-key'), {  
    getSecret: (request, keyId, callback) => {  
      const secret = keyId
      if (!secret) {  
        return callback(Unauthorized('Unknown client'))  
      }  
      callback(null, secret)  
    },      
  })  
  fastify.decorate('authenticate', async function (request, reply) {  
    try {  
      await request.apiKeyVerify()  
    } catch (err) {  
      reply.send(err)  
    }  
  }) 
})