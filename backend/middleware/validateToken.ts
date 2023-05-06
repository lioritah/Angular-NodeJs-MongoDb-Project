import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ValidationException } from "../exceptions/exceptions";

export type DecodedToken = string | JwtPayload | null;
export type AuthorizedRequest = Request & {
  userId?: DecodedToken;
};

export default function validateToken(
  request: AuthorizedRequest,
  response: Response,
  next: NextFunction
) {
  let token = request.headers["authorization"];
  if (!token) return next("Unauthorized");
  token = token.split("Bearer ")[1];
  try {
    const decoded = jwt.decode(token);
    if (!decoded) {
      throw new ValidationException("Unauthorized request - token invalid");
    }
    request.userId = decoded.sub as any;
    next();
  } catch (e) {
    next(e);
  }
}
