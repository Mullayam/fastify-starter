import fp from 'fastify-plugin'
import { FastifyJWTOptions } from '@fastify/jwt'

const options: FastifyJWTOptions = {
    secret: 'a string which is longer than 32 characters',
    cookie: {
        cookieName: 'token',
        signed: false
      }
}
//https://github.com/fastify/fastify-jwt
export default fp(async (fastify, opts) => {
    fastify.register(require('@fastify/jwt'), options)
   
})