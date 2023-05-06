import { Request, Response, NextFunction } from "express";

function catchExceptions(
  err: any,
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (response.headersSent) {
    return next(err);
  }
  // elvis optional operator
  console.log(err);
  const status = request.statusCode ?? 500;
  return response
    .status(status)
    .json(err.message ?? "Unknown error has occurred");
}

export default catchExceptions;
