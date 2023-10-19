import { mockUser } from '@/model/__mocks__/business/User';
import { SessionPrograms } from '@/programs/session.programs';
import { MockUserRepository, mockFindUser } from '@/repository/__mocks__/user';
import {
  MockJwtValidator,
  mockValidateToken,
} from '@/services/__mocks__/jwt-validator';

describe('SessionPrograms', () => {
  let sessionProgram: SessionPrograms;

  beforeAll(() => {
    const mockJwtValidator = new MockJwtValidator();
    const mockUserRepository = new MockUserRepository();
    sessionProgram = new SessionPrograms(mockJwtValidator, mockUserRepository);
  });

  describe('login', () => {
    const token = 'foo';

    it('should return user ID based on email', async () => {
      const user = await sessionProgram.login(token);

      expect(mockValidateToken).toHaveBeenCalledTimes(1);
      expect(mockFindUser).toHaveBeenCalledTimes(1);
      expect(user).toEqual(mockUser);
    });

    it('should not fetch user if no email', async () => {
      mockValidateToken.mockResolvedValueOnce(undefined);

      const user = await sessionProgram.login(token);

      expect(mockValidateToken).toHaveBeenCalledTimes(1);
      expect(mockFindUser).not.toHaveBeenCalled();
      expect(user).toEqual(undefined);
    });

    it('should return undefined if no user', async () => {
      mockFindUser.mockResolvedValueOnce(undefined);

      const user = await sessionProgram.login(token);

      expect(mockValidateToken).toHaveBeenCalledTimes(1);
      expect(mockFindUser).toHaveBeenCalledTimes(1);
      expect(user).toEqual(undefined);
    });
  });
});
