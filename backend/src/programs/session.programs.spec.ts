import { SessionPrograms } from './session.programs';
import { UserRepository } from '@/repository/user.repository';
import { JwtValidator } from '@/services/jwt-validator';

import { userRepositoryMock } from '@/mocks/userRepositoryMock';
import { LoggedInUser } from '@/models/business/User';

class jwtValidatorClassMock implements JwtValidator {
  async validateToken(_token: string): Promise<string | undefined> {
    return Promise.resolve('test@example.com');
  }
}

describe('SessionPrograms', () => {
  let sessionPrograms: SessionPrograms;
  let userRepository: UserRepository;
  let jwtValidator: JwtValidator;

  beforeEach(() => {
    userRepository = userRepositoryMock;
    jwtValidator = new jwtValidatorClassMock();
    sessionPrograms = new SessionPrograms(jwtValidator, userRepository);
  });

  describe('login', () => {
    const jwt = 'jwt';
    const sampleEmail = 'test@example.com';
    const user: LoggedInUser = {
      id: 1,
      pictureUrl: 'https://example.com/picture.jpg',
    };
    it('should return the user if the JWT is valid and the user exists', async () => {
      jest.spyOn(jwtValidator, 'validateToken').mockResolvedValue(sampleEmail);
      jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(user);

      const result = await sessionPrograms.login(jwt);

      expect(result).toEqual(user);
      expect(jwtValidator.validateToken).toHaveBeenCalledWith(jwt);
      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(sampleEmail);
    });

    it('should return undefined if the JWT is invalid', async () => {
      jest.spyOn(jwtValidator, 'validateToken').mockResolvedValue(undefined);

      const result = await sessionPrograms.login(jwt);

      expect(result).toBeUndefined();
      expect(jwtValidator.validateToken).toHaveBeenCalledWith(jwt);
      expect(userRepository.findUserByEmail).not.toHaveBeenCalled();
    });

    it('should return undefined if the user does not exist', async () => {
      const email = 'test@example.com';
      jest.spyOn(jwtValidator, 'validateToken').mockResolvedValue(email);
      jest
        .spyOn(userRepository, 'findUserByEmail')
        .mockResolvedValue(undefined);

      const result = await sessionPrograms.login(jwt);

      expect(result).toBeUndefined();
      expect(jwtValidator.validateToken).toHaveBeenCalledWith(jwt);
      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(email);
    });
  });
});
