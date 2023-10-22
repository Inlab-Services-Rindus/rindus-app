import { mockUser } from '@/models/__mocks__/business/User';
import { UserPrograms } from '@/programs/user.programs';
import { MockUserRepository, mockAll } from '@/repository/__mocks__/user';

describe('UserPrograms', () => {
  let userPrograms: UserPrograms;

  beforeAll(() => {
    const userRepository = new MockUserRepository();
    userPrograms = new UserPrograms(userRepository);
  });

  describe('index', () => {
    it('should call UserRepository', async () => {
      await userPrograms.index(false);

      expect(mockAll).toBeCalledTimes(1);
    });

    it('should map user to api model', async () => {
      mockAll.mockReturnValueOnce([mockUser]);

      const users = await userPrograms.index(false);

      const user = users[0];
      expect(user).not.toEqual(
        expect.objectContaining({
          id: mockUser.id,
          birthday: mockUser.birthday,
        }),
      );
    });

    it('should include birthday', async () => {
      mockAll.mockReturnValueOnce([mockUser]);

      const users = await userPrograms.index(false);

      const user = users[0];
      expect(user).toEqual(
        expect.objectContaining({
          isBirthday: expect.any(Boolean),
        }),
      );
    });

    it('should mock birthday if requested', async () => {
      mockAll.mockReturnValueOnce([mockUser]);

      const users = await userPrograms.index(true);

      const user = users[0];
      expect(user).toEqual(
        expect.objectContaining({
          isBirthday: true,
        }),
      );
    });
  });
});
