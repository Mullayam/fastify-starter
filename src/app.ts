// import { join } from 'path';
// import AutoLoad from '@fastify/autoload';
import fastifyPassport from '@fastify/passport';
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import fastifyFormBody from '@fastify/formbody';
// import mercurius from 'mercurius'
// import AltairFastify, { AltairFastifyPluginOptions } from 'altair-fastify-plugin'
import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import { CustomError } from './utils/libs/errors/customError';
import { Logging } from './utils/logs';

const options: FastifyServerOptions = {
  logger: true,


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
    this.app.register(fastifySession, {
      secret: process.env.SESSION_SECRET || 'fallback-session-secrefallback-session-secrefallback-session-secret', // Use the environment variable or a fallback secret
      cookie: { secure: !!process.env.USE_HTTPS || false }, // Set to true if using HTTPS
      saveUninitialized: false,
      cookieName: 'sessionId',
    });

    this.app.register(fastifyFormBody);
    this.app.register(fastifyPassport.initialize());
    this.app.register(fastifyPassport.secureSession());
    // this.app.register(mercurius, createMercuriusOptions(server));
    // this.app.register(AltairFastify, createAltairConfigurations())
   
  }
  private LoadPlugins() {
    // this.app.register(require('fastify-graceful-shutdown'))
    // // This loads all plugins defined in plugins those should be support plugins that are reused through your application
    // this.app.register(AutoLoad, {
    //   dir: join(__dirname, 'plugins'),
    //   options: Object.assign({}, opts),
    //   ignorePattern: /.*(model|schema)\.js/
    // })
  }
  private InitMiddlewares() { }
  private RegisterRoutes() {
    // // This loads all plugins defined in routes  define your routes in one of these
    // this.app.register(AutoLoad, {
    //   dir: join(__dirname, 'routes'),
    //   prefix: '/api',
    //   // options: opts
    // })
  }
  private ExceptionHandler() {
    this.app.setErrorHandler((error, request, reply) => {
      const customError: CustomError = error;
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
    return this.app

  }
  private ListenToEvents() {
    this.app
      .addHook("preClose", this.CloseFastify)
      .addHook("onClose", this.smoothlyClose)
      .addHook("onReady", () => {
        console.log("App is Ready")
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
      // Logging.dev("Error Occured", "error")

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
      // this.app.gracefulShutdown((signal, next) => {
      this.app.log.info('Received signal to shutdown: %s', "signal")
      //   next()
      // })
    })
  }
}








export const bootstrap = { AppServer: new Application() }

