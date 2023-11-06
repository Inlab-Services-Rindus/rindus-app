import { Knex } from 'knex';

import {
  LoggedInUser,
  User,
  WithInfo,
  WithLanguages,
} from '@/models/business/User';
import { UserRepository } from '@/repository/user.repository';
import {
  LoggedInUserRecord,
  UserProfileQueryRecord,
  UserRecord,
} from '@/models/service/database/UserRecord';
import {
  LoggedInUserConverter,
  UserConverter,
  UserWithInfoConverter,
} from '@/converters/service/UserRecord.converter';
import { Page } from '@/models/business/Pagination';
import { PageConverter } from '@/converters/service/Pagination.converter';
import { Language } from '@/models/business/Language';

export class KnexUserRepository implements UserRepository {
  private readonly knex: Knex;

  private readonly userConverter: UserConverter;
  private readonly userPageConverter: PageConverter<UserRecord, User>;
  private readonly loggedInConverter: LoggedInUserConverter;
  private readonly userWithInfoConverter: UserWithInfoConverter;

  private static readonly PAGE_SIZE = 18;

  constructor(knex: Knex) {
    this.knex = knex;
    this.userConverter = new UserConverter();
    this.userPageConverter = new PageConverter<UserRecord, User>(
      this.userConverter,
    );
    this.loggedInConverter = new LoggedInUserConverter();
    this.userWithInfoConverter = new UserWithInfoConverter();
  }
  async all(): Promise<User[]> {
    const userRecords = await this.knex('users');

    return this.mapToBusinesss(userRecords);
  }

  async page(
    page: number,
    pageSize = KnexUserRepository.PAGE_SIZE,
  ): Promise<Page<User>> {
    const queryUserRecords = this.knex('users')
      .offset((page - 1) * pageSize)
      .limit(pageSize);

    const queryTotalRecords = this.knex('users')
      .count<Record<string, number>>()
      .first();

    const [userRecords, totalRecords] = await Promise.all([
      queryUserRecords,
      queryTotalRecords,
    ]);

    return this.userPageConverter.convert([
      userRecords,
      this.totalPages(totalRecords),
    ]);
  }

  private mapToBusinesss(userRecords: UserRecord[]) {
    return userRecords.map((record) => this.userConverter.convert(record));
  }

  private totalPages(
    maybeTotalRecords: Record<string, number> | undefined,
  ): number {
    if (maybeTotalRecords) {
      return Math.ceil(maybeTotalRecords.count / KnexUserRepository.PAGE_SIZE);
    }

    return 0;
  }

  async findUserByEmail(email: string): Promise<LoggedInUser | undefined> {
    const maybeRecord = await this.selectLoggedInUserRecord()
      .where('email', email)
      .first();

    return this.toLoggedInUser(maybeRecord);
  }

  async findUserById(id: number): Promise<LoggedInUser | undefined> {
    const maybeRecord = await this.selectLoggedInUserRecord()
      .where('id', id)
      .first();

    return this.toLoggedInUser(maybeRecord);
  }

  private selectLoggedInUserRecord() {
    return this.knex('users').select('id', 'picture_url');
  }

  private toLoggedInUser(record: LoggedInUserRecord | undefined) {
    return record ? this.loggedInConverter.convert(record) : undefined;
  }

  async findUserWithInfo(
    id: number,
  ): Promise<(User & WithInfo & WithLanguages) | undefined> {
    const [maybeUserWithInfo, userLanguages] = await Promise.all([
      this.userWithInfo(id),
      this.userLanguages(id),
    ]);

    if (maybeUserWithInfo) {
      return {
        ...maybeUserWithInfo,
        languages: userLanguages,
      };
    }

    return undefined;
  }

  private async userWithInfo(
    id: number,
  ): Promise<(User & WithInfo) | undefined> {
    const maybeRecord = await this.knex<UserProfileQueryRecord>({
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
        { partner_id: 'p.id' },
        { partner_name: 'p.name' },
        { partner_logo_url: 'p.logo_url' },
        'position',
        'picture_url',
      )
      .where('u.id', id)
      .first();

    return maybeRecord
      ? this.userWithInfoConverter.convert(maybeRecord)
      : undefined;
  }

  private async userLanguages(userId: number): Promise<Language[]> {
    const languageRecords = await this.knex({ ul: 'users_languages' })
      .join({ l: 'languages' }, 'ul.language_id', 'l.id')
      .select('l.name')
      .where('ul.user_id', userId);

    return languageRecords.map((record) => record.name);
  }
}
