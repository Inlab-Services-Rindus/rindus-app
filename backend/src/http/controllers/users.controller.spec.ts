import { Request, Response } from 'express';
import { UsersController } from './users.controller';
import { UserPrograms } from '@/programs/user.programs';
import { UserRepository } from '@/repository/user.repository';
import {
  ShowUserConverter,
  UsersIndexConverter,
} from '@/converters/api/User.converter';
import { User } from '@/models/business/User';
import { Page } from '@/models/business/Pagination';
import { userWithInfoAndLanguagesMock } from '@/mocks/userMocks';

describe('UsersController', () => {
  let userPrograms: UserPrograms;
  let usersController: UsersController;
  let userRepository: UserRepository;
  let usersIndexConverter: UsersIndexConverter;
  let showUserConverter: ShowUserConverter;
  let request: Request;
  let response: Response;

  beforeEach(() => {
    userPrograms = new UserPrograms(userRepository);
    usersController = new UsersController(userPrograms);
    usersIndexConverter = new UsersIndexConverter();
    showUserConverter = new ShowUserConverter();
    request = {
      headers: {},
      query: {
        page: '1',
        pageSize: '3',
      },
      session: {
        userId: 1,
      },
    } as unknown as Request;
    response = {
      send: jest.fn(),
      sendStatus: jest.fn(),
    } as unknown as Response;
  });

  describe('index', () => {
    it('should return users index', async () => {
      const requestData: Page<User> = {
        data: [userWithInfoAndLanguagesMock],
        totalPages: 3,
      };

      userPrograms.index = jest.fn().mockResolvedValue(requestData);

      await usersController.index(request, response);

      expect(userPrograms.index).toHaveBeenCalledWith(1, 3, false, 1);
      expect(response.send).toHaveBeenCalledWith(
        usersIndexConverter.convert(requestData),
      );
    });
  });

  describe('show', () => {
    it('should return user details if user exists', async () => {
      const userId = '1';

      userPrograms.show = jest
        .fn()
        .mockResolvedValue(userWithInfoAndLanguagesMock);

      request.params = { userId };

      await usersController.show(request, response);

      expect(userPrograms.show).toHaveBeenCalledWith(1);
      expect(response.send).toHaveBeenCalledWith(
        showUserConverter.convert(userWithInfoAndLanguagesMock),
      );
    });

    it('should return 404 if user does not exist', async () => {
      const userId = '1';
      userPrograms.show = jest.fn().mockResolvedValue(null);

      request.params = { userId };

      await usersController.show(request, response);

      expect(userPrograms.show).toHaveBeenCalledWith(1);
      expect(response.sendStatus).toHaveBeenCalledWith(404);
    });
  });
});
