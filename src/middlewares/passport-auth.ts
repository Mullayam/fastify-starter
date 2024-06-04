import { FastifyRequest, PassportUser } from 'fastify';
import fastifyPassport from '@fastify/passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';


import { IncomingMessage } from 'http';

fastifyPassport.initialize()

fastifyPassport.use(
    new LocalStrategy(
        { passReqToCallback: true },
        async (req: IncomingMessage, email, password, done) => {
 

            try {
                const user = {password :""}
                if (!user) {
                    return done(null, false, { message: 'Incorrect email.' });
                }
                const isPasswordValid = await bcrypt.compare(password, user.password as any);
                if (!isPasswordValid) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

const serializeUser: unknown = (request: FastifyRequest, user: PassportUser, done: any) => {
    done(null, user, request);
};
fastifyPassport.serializeUser(serializeUser, {} as any);

const deserializeUser: unknown = async (request: FastifyRequest, userId: string, done: any) => {
    try {
        // const context: Context = {
        //   prisma: request.server.prisma,
        //   request,
        // };

        const user = {}

        if (!user) {
            throw new Error('User not found');
        }

        done(null, user);
    } catch (err) {
        done(err);
    }
};
fastifyPassport.deserializeUser(deserializeUser, {} as any);


export default fastifyPassport;