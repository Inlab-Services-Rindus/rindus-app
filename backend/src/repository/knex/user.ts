import { Knex } from 'knex';

import { User } from '@/model/business/User';
import { UserRepository } from '@/repository/user';
import { UserRecord } from '@/model/service/UserRecord';

export class KnexUserRepository implements UserRepository {
  private readonly knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  public findUserId(email: string): Promise<string | undefined> {
    return this.knex<UserRecord>('users')
      .select('id')
      .where('email', email)
      .first()
      .then((userRecord) => userRecord?.id.toFixed());
  }

  public all(): Promise<User[]> {
    return this.knex<UserRecord>('users')
      .select('id', 'first_name', 'last_name', 'email', 'profile_picture_url')
      .then((userRecords) =>
        userRecords.map((userRecord) => ({
          id: userRecord.id.toFixed(),
          firstName: userRecord.first_name,
          lastName: userRecord.last_name,
          email: userRecord.email,
          profilePictureUrl: userRecord.profile_picture_url,
        })),
      );
  }
}
