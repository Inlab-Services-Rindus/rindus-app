import { config } from '@/config';
import { NextFunction, Request, Response } from 'express';

export function httpBasicAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const auth = config.admin;

  // parse login and password from headers
  const b64auth = (request.headers.authorization || '').split(' ')[1] || '';
  const [login, password] = Buffer.from(b64auth, 'base64')
    .toString()
    .split(':');

  // Verify login and password are set and correct
  if (login && password && login === auth.user && password === auth.password) {
    return next();
  }

  response.set('WWW-Authenticate', 'Basic realm="401"');
  response.status(401).send('Authentication required.');
}
