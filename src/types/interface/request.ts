import { FastifyRequest } from "fastify";

export type ArticleCreateBodyRequest = FastifyRequest<{
  Body: {
    title?: string | undefined;
    text?: string | undefined;
    type?: string | undefined;
    userId?: string | undefined;
  };
}>;
