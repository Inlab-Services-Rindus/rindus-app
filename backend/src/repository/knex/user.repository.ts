import { Knex } from 'knex';

import { LoggedInUser, User, WithInfo } from '@/models/business/User';
import { UserRepository } from '@/repository/user.repository';
import {
  LoggedInUserRecord,
  UserRecord,
  WithOffice,
  WithPartner,
} from '@/models/service/UserRecord';
import {
  LoggedInUserConverter,
  UserConverter,
  UserWithInfoConverter,
} from '@/models/service/converters/UserRecord.converter';
import { toRecordId } from '@/helpers/RecordConverterHelper';

export class KnexUserRepository implements UserRepository {
  private readonly knex: Knex;

  private readonly userConverter: UserConverter;
  private readonly loggedInConverter: LoggedInUserConverter;
  private readonly userWithInfoConverter: UserWithInfoConverter;

  constructor(knex: Knex) {
    this.knex = knex;
    this.userConverter = new UserConverter();
    this.loggedInConverter = new LoggedInUserConverter();
    this.userWithInfoConverter = new UserWithInfoConverter();
  }

  async all(): Promise<User[]> {
    const userRecords = await this.knex('users');

    return userRecords.map((record) => this.userConverter.convert(record));
  }

  async findUserByEmail(email: string): Promise<LoggedInUser | undefined> {
    const maybeRecord = await this.selectLoggedInUserRecord()
      .where('email', email)
      .first();

    return this.toLoggedInUser(maybeRecord);
  }

  async findUserById(id: string): Promise<LoggedInUser | undefined> {
    const maybeUserId = toRecordId(id);

    if (!maybeUserId) {
      return undefined;
    }

    const maybeRecord = await this.selectLoggedInUserRecord()
      .where('id', maybeUserId)
      .first();

    return this.toLoggedInUser(maybeRecord);
  }

  private selectLoggedInUserRecord() {
    return this.knex('users').select('id', 'picture_url');
  }

  private toLoggedInUser(record: LoggedInUserRecord | undefined) {
    return record ? this.loggedInConverter.convert(record) : undefined;
  }

  async findUserWithInfoById(
    id: string,
  ): Promise<(User & WithInfo) | undefined> {
    const maybeUserId = toRecordId(id);

    if (!maybeUserId) {
      return undefined;
    }

    const maybeRecord = await this.knex<UserRecord & WithOffice & WithPartner>({
      u: 'users',
    })
      .leftJoin({ p: 'partners' }, 'u.partner_id', 'p.id')
      .leftJoin({ o: 'offices' }, 'u.office_id', 'o.id')
      .select(
        { id: 'u.id' },
        'first_name',
        'last_name',
        'email',
        { office_name: 'o.name' },
        { partner_name: 'p.name' },
        'position',
        'picture_url',
      )
      .where('u.id', maybeUserId)
      .first();

    return maybeRecord
      ? this.userWithInfoConverter.convert(maybeRecord)
      : undefined;
  }
}
