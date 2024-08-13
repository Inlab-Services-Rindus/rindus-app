import { logger } from '@/bootstrap/logger';
import { SESSION_COOKIE_NAME, cookieConfig } from '@/bootstrap/sessions';
import { config, isLiveEnvironment } from '@/config';
import { LoggedInUserConverter } from '@/converters/api/Session.converter';
import { SessionPrograms } from '@/programs/session.programs';
import { UserRepository } from '@/repository/user.repository';
import { CookieOptions, Request, Response } from 'express';
import NodeCache from 'node-cache';

export class SessionController {
  private readonly sessionProgram: SessionPrograms;

  private readonly userRepository: UserRepository;

  private readonly loggedInUserConverter: LoggedInUserConverter;

  private readonly eventsCache: NodeCache;

  constructor(
    sessionPrograms: SessionPrograms,
    userRepository: UserRepository,
    eventsCache: NodeCache,
  ) {
    this.sessionProgram = sessionPrograms;
    this.userRepository = userRepository;
    this.loggedInUserConverter = new LoggedInUserConverter();
    this.eventsCache = eventsCache;
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
    if (!request.cookies[SESSION_COOKIE_NAME]) {
      return response.sendStatus(204);
    }

    const maybeUserId = request.session?.userId;

    if (maybeUserId) {
      const maybeUser = await this.userRepository.findUserById(maybeUserId);

      if (maybeUser) {
        this.eventsCache.flushAll();

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
        .cookie(SESSION_COOKIE_NAME, '', {
          ...cookieConf,
          maxAge: 1,
        } as CookieOptions)
        .sendStatus(200);
    }

    return response.sendStatus(200);
  }
}
