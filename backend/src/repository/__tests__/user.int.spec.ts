import { connectTestDatabase } from '@/bootstrap/database';
import { UserRecord } from '@/model/service/UserRecord';
import { KnexUserRepository } from '@/repository/knex/user';

describe('KnexUserRepository', () => {
  let userRepository: KnexUserRepository;
  const findableUserId = 2;
  const findableUserEmail = 'test@email.com';
  const findableUser = {
    id: findableUserId,
    email: findableUserEmail,
    first_name: 'Found',
    last_name: 'User',
  };

  beforeAll(async () => {
    const knex = connectTestDatabase();
    await knex<UserRecord>('users').insert([
      {
        id: 1,
        email: 'one@email.com',
        first_name: 'Foo',
        last_name: 'Bar',
      },
      findableUser,
    ]);

    userRepository = new KnexUserRepository(knex);
  });

  describe('findUserId', () => {
    it('should find user ID by email', async () => {
      const userId = await userRepository.findUserId(findableUserEmail);

      expect(userId).toEqual(findableUserId.toFixed());
    });

    it('should return undefined if user not found', async () => {
      const userId = await userRepository.findUserId('foo');

      expect(userId).toEqual(undefined);
    });
  });

  describe('all', () => {
    it('should return all users', async () => {
      const users = await userRepository.all();

      expect(users).toHaveLength(2);
    });

    it('should return empty array if no users', async () => {
      await connectTestDatabase()('users').truncate();

      const users = await userRepository.all();

      expect(users).toEqual([]);
    });
  });
});
