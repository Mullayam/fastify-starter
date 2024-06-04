/**
 * @type {import('fastify').RouteShorthandOptions}
 * @const
 */
export const opts = {
    schema: {
        tags: ["auth"],
        security: [{ apiKey: [] }],
        response: {
            200: {
                type: 'object',
                properties: {
                    hello: { type: 'string' }
                }
            }
        }
    }
}
