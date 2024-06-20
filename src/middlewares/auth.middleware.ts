import { FastifyRequest } from "fastify";
import { verify } from "jsonwebtoken";
import customError from "../utils/libs/errors/customError";
import authErrors from "../utils/libs/errors/auth.errors";
import { CONFIG } from "../config";

export class AuthMiddleware {
  static async verifyToken(request: FastifyRequest): Promise<boolean> {
    try {
      const token = this.validateHeadersAuth(request);
      const decoded: any = Object(verify(token, CONFIG.webtoken as string));
      request.user = decoded.aud;
      return true;
    } catch (err: any) {
      customError(err);
      return false;
    }
  }

  private static validateHeadersAuth(request: FastifyRequest):string {
    const header: string | undefined = request.headers.authorization;
    if (!header) {
      customError(authErrors.AuthMissingHeaders);
    }
    const accessToken: string = header!.split(" ")[1];
    if (!accessToken) {
      customError(authErrors.AuthMissingHeaders);
    }
    return accessToken;
  }
}