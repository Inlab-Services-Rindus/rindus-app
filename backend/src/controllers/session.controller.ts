import { logger } from '@/bootstrap/logger';
import { SessionPrograms } from '@/programs/session.programs';
import { UserRepository } from '@/repository/user.repository';
import { Request, Response } from 'express';

export class SessionController {
  private readonly sessionProgram: SessionPrograms;

  private readonly userRepository: UserRepository;

  constructor(
    sessionPrograms: SessionPrograms,
    userRepository: UserRepository,
  ) {
    this.sessionProgram = sessionPrograms;
    this.userRepository = userRepository;
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

  public async softLogin(request: Request, response: Response) {
    if (!request.cookies['connect.sid']) {
      return response.sendStatus(400);
    }

    const maybeUserId = request.session?.userId;

    if (maybeUserId) {
      const maybeUser = await this.userRepository.findUserById(maybeUserId);

      if (maybeUser) {
        return response.send(maybeUser);
      }

      return response.sendStatus(401);
    }

    return response.sendStatus(401);
  }

  public async logout(request: Request, response: Response) {
    const userId = request.session?.userId;

    if (userId) {
      request.session.destroy(() => logger.debug('User session destroyed'));

      return response.cookie('connect.sid', '', { maxAge: 1 }).sendStatus(200);
    }

    return response.sendStatus(200);
  }
}
