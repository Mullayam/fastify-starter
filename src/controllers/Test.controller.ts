import { FastifyRequest, FastifyReply } from "fastify"

class TestController {
    async test(_req: FastifyRequest<{Body: {name: string}}>, _res: FastifyReply) {
        const { name } = _req.body
        return `Hello ${name}`
    }
}
export default new TestController()