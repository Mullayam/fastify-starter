import fp from 'fastify-plugin'

import type { RateLimitOptions } from '@fastify/rate-limit'
import rateLimit from '@fastify/rate-limit'

/**
 * This plugins adds rate limiter for your routes.
 *
 * @see https://github.com/fastify/fastify-rate-limit
 */
export default fp<RateLimitOptions>(
  async (
    fastify,
    opts = {
      max: 100,
      timeWindow: '1 minute',
      allowList: function (request, key) {
        return request.headers['x-app-client-id'] === 'internal-usage'
      },
      errorResponseBuilder: function (request, context) {
        return {
          success: false,
          message: "You hit the rate limit! Slow down please!",
          stack: {
            statusCode: 429,
            error: 'Too Many Requests',
            message: `I only allow ${context.max} requests per ${context.after} to this Website. Try again soon.`,
            date: Date.now(),
            expiresIn: context.ttl // milliseconds
          }
        }
      }
    },

  ) => {
    await fastify.register(rateLimit, {
      ...opts,
    })
  },
)