import { Knex } from 'knex';

import { User } from '@/model/business/User';
import { UserRepository } from '@/repository/user.repository';
import { UserRecord } from '@/model/service/UserRecord';

export class KnexUserRepository implements UserRepository {
  private readonly knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  public findUser(email: string): Promise<User | undefined> {
    return this.knex<UserRecord>('users')
      .select('id', 'first_name', 'last_name', 'email', 'profile_picture_url')
      .where('email', email)
      .first()
      .then((userRecord) =>
        userRecord ? this.recordToUser(userRecord) : undefined,
      );
  }

  public all(): Promise<User[]> {
    return this.knex<UserRecord>('users')
      .select('id', 'first_name', 'last_name', 'email', 'profile_picture_url')
      .then((userRecords) =>
        userRecords.map((record) => this.recordToUser(record)),
      );
  }

  private recordToUser(userRecord: UserRecord): User {
    return {
      id: userRecord.id.toFixed(),
      firstName: userRecord.first_name,
      lastName: userRecord.last_name,
      email: userRecord.email,
      profilePictureUrl: this.mapAvatarUrl(userRecord.profile_picture_url),
    };
  }

  private mapAvatarUrl(personioUrl?: string) {
    const personioImageServer = 'https://images.personio.de/';
    if (personioUrl && personioUrl.includes(personioImageServer)) {
      return personioUrl
        .replace(personioImageServer, '/avatars/')
        .replace('small', 'large');
    } else {
      return personioUrl;
    }
  }
}
