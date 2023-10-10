import { SessionPrograms } from '@/programs/session';
import {
  MockUserRepository,
  mockFindUserId,
} from '@/repository/__mocks__/user';
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
      const userId = await sessionProgram.login(token);

      expect(mockValidateToken).toHaveBeenCalledTimes(1);
      expect(mockFindUserId).toHaveBeenCalledTimes(1);
      expect(userId).toEqual('userId');
    });

    it('should not fetch user if no email', async () => {
      mockValidateToken.mockResolvedValueOnce(undefined);

      const userId = await sessionProgram.login(token);

      expect(mockValidateToken).toHaveBeenCalledTimes(1);
      expect(mockFindUserId).not.toHaveBeenCalled();
      expect(userId).toEqual(undefined);
    });

    it('should return undefined if no user', async () => {
      mockFindUserId.mockResolvedValueOnce(undefined);

      const userId = await sessionProgram.login(token);

      expect(mockValidateToken).toHaveBeenCalledTimes(1);
      expect(mockFindUserId).toHaveBeenCalledTimes(1);
      expect(userId).toEqual(undefined);
    });
  });
});
