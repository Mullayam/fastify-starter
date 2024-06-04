import { FastifyInstance } from "fastify";
import { AuthMiddleware } from "./auth.middleware";

export const ProtectedRoutes = async (
    app: FastifyInstance,
    routesToProtect: any
) => {
    app.addHook("onRequest", async (request, reply) => {
        try {
            const requestPath: string = request.routerPath;
            if (routesToProtect[requestPath]) {
                await AuthMiddleware.verifyToken(request);
            }
        } catch (error) {
            reply.send(error);
        }
    });
};

export default { ProtectedRoutes };