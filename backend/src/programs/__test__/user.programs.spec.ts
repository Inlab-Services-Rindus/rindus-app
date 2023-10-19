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
      await userPrograms.index();

      expect(mockAll).toBeCalledTimes(1);
    });
  });
});
