import { logger } from '@/bootstrap/logger';
import { cookieConfig } from '@/bootstrap/sessions';
import { config, isLiveEnvironment } from '@/config';
import { LoggedInUserConverter } from '@/models/api/converters/User.converter';
import { SessionPrograms } from '@/programs/session.programs';
import { UserRepository } from '@/repository/user.repository';
import { CookieOptions, Request, Response } from 'express';

export class SessionController {
  private readonly sessionProgram: SessionPrograms;

  private readonly userRepository: UserRepository;

  private readonly loggedInUserConverter: LoggedInUserConverter;

  constructor(
    sessionPrograms: SessionPrograms,
    userRepository: UserRepository,
  ) {
    this.sessionProgram = sessionPrograms;
    this.userRepository = userRepository;
    this.loggedInUserConverter = new LoggedInUserConverter();
  }

  public async login(request: Request, response: Response) {
    const jwt = request.body?.jwt;

    if (!jwt) {
      return response.sendStatus(400);
    }

    const maybeUser = await this.sessionProgram.login(jwt);

    if (maybeUser !== undefined) {
      const apiUserLogin = this.loggedInUserConverter.convert(maybeUser);
      request.session.userId = apiUserLogin.id;

      return response.send(apiUserLogin);
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
        return response.send(this.loggedInUserConverter.convert(maybeUser));
      }

      return response.sendStatus(401);
    }

    return response.sendStatus(401);
  }

  public async logout(request: Request, response: Response) {
    const userId = request.session?.userId;

    if (userId) {
      request.session.destroy(() => logger.debug('User session destroyed'));

      const cookieConf = cookieConfig(isLiveEnvironment(config));
      return response
        .cookie('connect.sid', '', {
          ...cookieConf,
          maxAge: 1,
        } as CookieOptions)
        .sendStatus(200);
    }

    return response.sendStatus(200);
  }
}
