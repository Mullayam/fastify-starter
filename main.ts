import "dotenv/config";
import { FastifyInstance } from "fastify"
import { bootstrap } from "./src/app"
import { CONFIG } from "./src/config";
// import { join } from "path"; 
// Application
const app: FastifyInstance = bootstrap.AppServer.InitailizeApplication()

const PORT: string | number = CONFIG.port

function main() {
    app.listen({ port: Number(PORT) }, (err) => {
        if (err) {
            app.log.error(err);
            process.exit(1)
        }
        app.log.info(`server listening on ${PORT}`)
    })
    // app.register(require('@fastify/static'), {
    //     root: join(__dirname, 'public'),
    //     prefix: '/public/', // optional: default '/'
    //     constraints: { host: 'example.com' } // optional: default {}
    // })
}
main()