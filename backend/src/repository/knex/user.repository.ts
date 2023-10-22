import { Knex } from 'knex';

import { User } from '@/models/business/User';
import { UserRepository } from '@/repository/user.repository';
import { UserRecord } from '@/models/service/UserRecord';

export class KnexUserRepository implements UserRepository {
  private readonly knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  public findUserByEmail(email: string): Promise<User | undefined> {
    return this.knex<UserRecord>('users')
      .select('id', 'first_name', 'last_name', 'email', 'profile_picture_url')
      .where('email', email)
      .first()
      .then((userRecord) =>
        userRecord ? this.recordToUser(userRecord) : undefined,
      );
  }

  public findUserById(id: string): Promise<User | undefined> {
    return this.knex<UserRecord>('users')
      .select('id', 'first_name', 'last_name', 'email', 'profile_picture_url')
      .where('id', Number(id))
      .first()
      .then((userRecord) =>
        userRecord ? this.recordToUser(userRecord) : undefined,
      );
  }

  public all(): Promise<User[]> {
    return this.knex<UserRecord>('users')
      .select(
        'id',
        'first_name',
        'last_name',
        'email',
        'profile_picture_url',
        'birthday',
      )
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
      birthday: userRecord.birthday,
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
