import { logger } from '@/bootstrap/logger';
import { SessionPrograms } from '@/programs/session.programs';
import { Request, Response } from 'express';

export class SessionController {
  private readonly sessionProgram: SessionPrograms;

  constructor(sessionPrograms: SessionPrograms) {
    this.sessionProgram = sessionPrograms;
  }

  public async login(request: Request, response: Response) {
    const jwt = request.body?.jwt;

    if (!jwt) {
      return response.sendStatus(400);
    }

    const maybeUser = await this.sessionProgram.login(jwt);

    if (maybeUser !== undefined) {
      request.session.userId = maybeUser.id;

      return response.send(maybeUser);
    }

    return response.sendStatus(401);
  }

  public async logout(request: Request, response: Response) {
    const userId = request.session?.userId;

    if (userId) {
      request.session.destroy(() => logger.debug('User session destroyed'));

      return response.sendStatus(200);
    }

    return response.sendStatus(200);
  }
}
