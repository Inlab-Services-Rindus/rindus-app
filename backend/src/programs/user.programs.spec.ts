import { userRepositoryMock } from '@/mocks/userRepositoryMock';
import { UserRepository } from '@/repository/user.repository';
import { UserPrograms } from './user.programs';

describe('UserPrograms', () => {
  let userPrograms: UserPrograms;
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = userRepositoryMock;
    userPrograms = new UserPrograms(userRepository);
  });

  describe('index', () => {
    it('should return users received by userRepository', async () => {
      userRepository.page = jest.fn().mockResolvedValue({
        data: [
          {
            id: 1,
            name: 'Test User',
            pictureUrl: 'https://example.com/picture.jpg',
            isBirthday: false,
          },
        ],
        page: 1,
        pageSize: 10,
        total: 1,
      });
      const result = await userPrograms.index(1, 10, false, 1);

      expect(result).toEqual({
        data: [
          {
            id: 1,
            name: 'Test User',
            pictureUrl: 'https://example.com/picture.jpg',
            isBirthday: false,
          },
        ],
        page: 1,
        pageSize: 10,
        total: 1,
      });
    });

    it('should return users with isBirthday mocked if mockBirthdays is true', async () => {
      userRepository.page = jest.fn().mockResolvedValue({
        data: [
          {
            id: 1,
            name: 'Test User',
            pictureUrl: 'https://example.com/picture.jpg',
            isBirthday: false,
          },
        ],
        page: 1,
        pageSize: 10,
        total: 1,
      });
      const result = await userPrograms.index(1, 10, true, 1);

      expect(result).toEqual({
        data: [
          {
            id: 1,
            name: 'Test User',
            pictureUrl: 'https://example.com/picture.jpg',
            isBirthday: true,
          },
        ],
        page: 1,
        pageSize: 10,
        total: 1,
      });
    });

    it('should reject when userRepository.page rejects', async () => {
      const error = new Error('Test error');
      userRepository.page = jest.fn().mockRejectedValue(error);

      await expect(userPrograms.index(1, 10, false, 1)).rejects.toThrow(error);
    });
  });

  describe('show', () => {
    it('should return user with info and languages', async () => {
      const userId = 1;
      const userWithInfoAndLanguages = {
        id: 1,
        name: 'Test User',
        pictureUrl: 'https://example.com/picture.jpg',
        isBirthday: false,
        info: {
          age: 25,
          gender: 'male',
        },
        languages: ['English', 'Spanish'],
      };
      userRepository.findUserWithInfo = jest
        .fn()
        .mockResolvedValue(userWithInfoAndLanguages);

      const result = await userPrograms.show(userId);

      expect(result).toEqual(userWithInfoAndLanguages);
    });

    it('should return undefined if user is not found', async () => {
      const userId = 1;
      userRepository.findUserWithInfo = jest.fn().mockResolvedValue(undefined);

      const result = await userPrograms.show(userId);

      expect(result).toBeUndefined();
    });
  });
});
