import fp from 'fastify-plugin'
import { FastifyCsrfProtectionOptions } from '@fastify/csrf-protection'

const options: FastifyCsrfProtectionOptions = {
    cookieOpts: {
        signed: true
    }
}
// https://github.com/fastify/csrf-protection
export default fp(async (fastify, opts) => {
//    await fastify.register(require('@fastify-session'), { secret: "a string which is longer than 32 characters" })
    fastify.register(require('@fastify/csrf-protection'), options)
})