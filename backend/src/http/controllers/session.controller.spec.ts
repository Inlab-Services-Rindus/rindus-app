import { Request, Response } from 'express';
import { SessionController } from '@/http/controllers/session.controller';
import { SessionPrograms } from '@/programs/session.programs';
import { JwtValidator } from '@/services/jwt-validator';
import { Session } from 'express-session';
import { LoggedInUserConverter } from '@/converters/api/Session.converter';
import { SESSION_COOKIE_NAME } from '@/bootstrap/sessions';
import { UserRepository } from '@/repository/user.repository';
import { LoggedInUser } from '@/models/business/User';
import { logger } from '@/bootstrap/logger';
import { userRepositoryMock } from '@/mocks/userRepositoryMock';

describe('SessionController', () => {
  let jwtValidator: JwtValidator;
  let sessionPrograms: SessionPrograms;
  let userRepository: UserRepository;
  let loggedInUserConverter: LoggedInUserConverter;
  let sessionController: SessionController;
  let request: Request;
  let response: Response;

  beforeEach(() => {
    userRepository = userRepositoryMock;
    sessionPrograms = new SessionPrograms(jwtValidator, userRepository);
    loggedInUserConverter = new LoggedInUserConverter();
    sessionController = new SessionController(sessionPrograms, userRepository);
    request = {
      cookies: {},
      body: {},
      session: {},
    } as Request;
    response = {
      send: jest.fn(),
      sendStatus: jest.fn(),
      cookie: jest.fn(),
      session: {},
    } as unknown as Response;
  });

  describe('login', () => {
    it('should send 400 status if jwt is not provided', async () => {
      await sessionController.login(request, response);

      expect(response.sendStatus).toHaveBeenCalledWith(400);
    });

    it('should send 401 status if login fails', async () => {
      const jwt = 'exampleJwt';
      request.body = { jwt };

      sessionPrograms.login = jest.fn().mockResolvedValue(undefined);

      await sessionController.login(request, response);

      expect(sessionPrograms.login).toHaveBeenCalledWith(jwt);
      expect(response.sendStatus).toHaveBeenCalledWith(401);
    });

    it('should send user login data if login succeeds', async () => {
      const jwt = 'exampleJwt';
      const maybeUser = {
        id: 123,
        pictureUrl: 'www.example.com',
      };
      const convertedUser = loggedInUserConverter.convert(maybeUser);
      request.body = { jwt };

      sessionPrograms.login = jest.fn().mockResolvedValue(maybeUser);
      await sessionController.login(request, response);

      expect(sessionPrograms.login).toHaveBeenCalledWith(jwt);
      expect(request.session.userId).toBe(convertedUser.id);
      expect(response.send).toHaveBeenCalledWith(convertedUser);
    });
  });

  describe('softLogin', () => {
    it('should send 204 status if session cookie is not present', async () => {
      await sessionController.softLogin(request, response);

      expect(response.sendStatus).toHaveBeenCalledWith(204);
    });

    it('should send 401 status if user is not found in the repository', async () => {
      const maybeUserId = 123;
      request.cookies = { [SESSION_COOKIE_NAME]: 'exampleSessionCookie' };
      request.session = { userId: maybeUserId } as unknown as Session;
      jest
        .spyOn(userRepositoryMock, 'findUserById')
        .mockResolvedValueOnce(undefined);

      await sessionController.softLogin(request, response);

      expect(userRepository.findUserById).toHaveBeenCalledWith(maybeUserId);
      expect(response.sendStatus).toHaveBeenCalledWith(401);
    });

    it('should send 401 status if there is no userId in the request', async () => {
      request.cookies = { [SESSION_COOKIE_NAME]: 'exampleCookie' };
      request.session = {} as unknown as Session;

      await sessionController.softLogin(request, response);

      expect(response.sendStatus).toHaveBeenCalledWith(401);
    });

    it('should send user login data if user is found in the repository', async () => {
      const maybeUserId = 123;
      request.cookies = { [SESSION_COOKIE_NAME]: 'exampleCookie' };
      request.session = { userId: maybeUserId } as unknown as Session;
      jest
        .spyOn(userRepositoryMock, 'findUserById')
        .mockResolvedValueOnce(maybeUserId as unknown as LoggedInUser);
      userRepository.findUserById = jest.fn().mockResolvedValue(maybeUserId);

      await sessionController.softLogin(request, response);

      expect(userRepository.findUserById).toHaveBeenCalledWith(maybeUserId);
      expect(response.send).toHaveBeenCalledWith(
        loggedInUserConverter.convert(maybeUserId as unknown as LoggedInUser),
      );
    });
  });

  describe('logout', () => {
    it('should destroy user session and send 200 status if userId is present', async () => {
      const loggerdebugSpy = jest.spyOn(logger, 'debug');
      const maybeUserId = 123;
      request.session = { userId: maybeUserId } as unknown as Session;
      request.session.destroy = jest.fn((callback) => {
        callback();
      }) as unknown as Session['destroy'];

      const cookieOptions = {
        httpOnly: false,
        maxAge: 1,
        sameSite: 'lax',
        secure: false,
      };
      response.cookie = jest.fn().mockReturnValue(response);
      response.sendStatus = jest.fn().mockReturnValue(response);

      await sessionController.logout(request, response);

      expect(loggerdebugSpy).toHaveBeenCalledWith('User session destroyed');
      expect(request.session.destroy).toHaveBeenCalled();
      expect(response.cookie).toHaveBeenCalledWith(
        SESSION_COOKIE_NAME,
        '',
        cookieOptions,
      );
      expect(response.sendStatus).toHaveBeenCalledWith(200);
    });

    it('should send 200 status if userId is not present', async () => {
      await sessionController.logout(request, response);

      expect(response.sendStatus).toHaveBeenCalledWith(200);
    });
  });
});
