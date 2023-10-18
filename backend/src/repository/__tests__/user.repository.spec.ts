import { connectTestDatabase } from '@/bootstrap/database';
import { UserRecord } from '@/model/service/UserRecord';
import { KnexUserRepository } from '@/repository/knex/user.repository';

describe('KnexUserRepository', () => {
  let userRepository: KnexUserRepository;
  const findableUserEmail = 'test@email.com';
  const findableUser = {
    id: 2,
    email: findableUserEmail,
    first_name: 'Found',
    last_name: 'User',
    profile_picture_url: 'url',
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

  describe('findUser', () => {
    it('should find user by email', async () => {
      const user = await userRepository.findUser(findableUserEmail);

      expect(user).toEqual({
        id: findableUser.id.toFixed(),
        firstName: findableUser.first_name,
        lastName: findableUser.last_name,
        email: findableUser.email,
        profilePictureUrl: findableUser.profile_picture_url,
      });
    });

    it('should return undefined if user not found', async () => {
      const user = await userRepository.findUser('foo');

      expect(user).toEqual(undefined);
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
