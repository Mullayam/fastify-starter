import "dotenv/config";
import { FastifyInstance } from "fastify"
import { bootstrap } from "./src/app"
import { CONFIG } from "./src/config";
import { Logging } from "./src/utils/logs";
// import { join } from "path";

function main() {
    const app: FastifyInstance = bootstrap.AppServer.InitailizeApplication()
    const PORT: string | number = CONFIG.port
    app.listen({ port: Number(PORT) }, (err) => {
        if (err) {
            Logging.dev(err.message, "error");
            process.exit(1)
        }
    })
    // app.register(require('@fastify/static'), {
    //     root: join(__dirname, 'public'),
    //     prefix: '/public/', // optional: default '/'
    //     constraints: { host: 'example.com' } // optional: default {}
    // })
}
main()