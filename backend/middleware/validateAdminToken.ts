import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import UserModel from "../models/User";
import { ValidationException } from "../exceptions/exceptions";
import { AuthorizedRequest } from "./validateToken";
export default async function validateToken(
  request: AuthorizedRequest,
  response: Response,
  next: NextFunction
) {
  let token = request.headers["authorization"];
  if (!token) return next("Unauthorized");
  token = token.split("Bearer ")[1];
  try {
    const decoded = jwt.decode(token);
    request.userId = decoded.sub as any;
    const user = await UserModel.findById(request.userId).exec();
    if (!user || user.roles !== "admin")
      throw new ValidationException("Unauthorized");
    else next();
  } catch (e) {
    next(e);
  }
}
