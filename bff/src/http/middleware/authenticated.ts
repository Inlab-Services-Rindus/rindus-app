import { NextFunction, Request, Response } from 'express';

export function authenticated(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  // if (request.session.userId) {
  next();
  // } else {
  //   response.sendStatus(401);
  // }
}
