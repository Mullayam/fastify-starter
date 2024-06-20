import { join } from 'path';
import AutoLoad from '@fastify/autoload';
// import fastifyPassport from '@fastify/passport';
import fastifyCookie from '@fastify/cookie';
// import fastifySession from '@fastify/session';
import fastifyFormBody from '@fastify/formbody';
import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
// import fastifyPrintRoutes from 'fastify-print-routes'
import { CustomError } from './utils/libs/errors/customError';
import { Logging } from './utils/logs';

const options: FastifyServerOptions = {
  logger: {
    transport: {
      target: "@fastify/one-line-logger",      
    },
  },
}
class Application {
  private app: FastifyInstance = fastify(options)
  constructor() {
    this.ApplyConfiguration();
    this.LoadPlugins();
    this.InitMiddlewares();
    this.RegisterRoutes();
    this.ExceptionHandler();
    this.ListenToEvents()

  }
  private ApplyConfiguration() {
    this.app.register(fastifyCookie);
    // this.app.register(fastifySession, {
    //   secret: process.env.SESSION_SECRET || 'fallback-session-secrefallback-session-secrefallback-session-secret', // Use the environment variable or a fallback secret
    //   cookie: { secure: !!process.env.USE_HTTPS || false }, // Set to true if using HTTPS
    //   saveUninitialized: false,
    //   cookieName: 'sessionId',
    // });

    this.app.register(fastifyFormBody);
    // this.app.register(fastifyPassport.initialize());
    // this.app.register(fastifyPassport.secureSession());

  }
  private LoadPlugins() {
    this.app.register(require('fastify-graceful-shutdown'))
    // // This loads all plugins defined in plugins those should be support plugins that are reused through your application
    this.app.register(AutoLoad, {
      dir: join(__dirname, 'plugins'),
      ignorePattern: /.*(model|schema)\.js/
    })
  }
  private InitMiddlewares() { }
  private RegisterRoutes() {
    // This loads all plugins defined in routes  define your routes in one of these
    this.app.register(AutoLoad, { dir: join(__dirname, 'routes') })
  }
  private ExceptionHandler() {
    this.app.setNotFoundHandler({
    }, function (request, reply) {
      reply.code(404).send({
        success: false, message: "Not Found", stack:
        {
          code: 404,
          info: `Route ${request.method} ${request.url} Not Found`
        }
      })
    })
    this.app.setErrorHandler((error, request, reply) => {
      const customError: CustomError = error;
      if (error.statusCode === 429) {
        return reply.status(429).send({
          error: {
            message: "You hit the rate limit! Slow down please!",
            code: customError.code,
            data: customError.data,
          }
        })

      }
      reply.status(customError.statusCode || 500).send({
        error: {
          message: customError.message,
          code: customError.code,
          data: customError.data,
        }
      })
    })
  };
  InitailizeApplication(): FastifyInstance {
    // this.app.register(fastifyPrintRoutes)
    return this.app

  }
  private ListenToEvents() {
    this.app
      .addHook("preClose", this.CloseFastify)
      .addHook("onClose", this.smoothlyClose)
      .addHook("onReady", () => {
        Logging.dev("App is Ready")
        this.GracefulShutdown()
      })
      .addHook("onError", () => console.log("Got An Error"))
  }
  private CloseFastify() {
    this.app.close();
    process.exit(1)
  }
  /**
    * Gracefully shuts down the application.
    *
    * @private
    */
  private GracefulShutdown() {
    process.on('SIGINT', () => {
      Logging.dev("Manually Shutting Down", "notice")
      process.exit(1);
    })
    process.on('SIGTERM', () => {
      Logging.dev("Error Occured", "error")
      process.exit(1);
    })
    process.on('uncaughtException', (err, origin) => {
      Logging.dev(`Uncaught Exception ${err.name} ` + err.message + err.stack, "error")
      Logging.dev(`Origin Of Error ${origin} `, "error")

    });
    process.on('unhandledRejection', (reason, promise) => {
      Logging.dev(`Unhandled Rejection at ${promise}, reason: ${reason}`, "error")
    });
  }
  private smoothlyClose() {
    this.app.after(() => {
      this.app.log.info('Received signal to shutdown: %s', "signal")
    })
  }
}








export const bootstrap = { AppServer: new Application() }

