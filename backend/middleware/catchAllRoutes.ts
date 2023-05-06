import { Request, Response, NextFunction } from "express";

function catchAllRoutes(
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (response.headersSent) {
    return next();
  }

  return response.status(404).send("Not found route");
}

export default catchAllRoutes;
