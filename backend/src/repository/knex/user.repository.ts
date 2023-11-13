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
  UserViewRecord,
} from '@/models/service/database/UserRecord';
import {
  LoggedInUserConverter,
  UserConverter,
  UserViewConverter,
  UserWithInfoConverter,
} from '@/converters/service/UserRecord.converter';
import { Page } from '@/models/business/Pagination';
import { PageConverter } from '@/converters/service/Pagination.converter';
import { Language } from '@/models/business/Language';

export class KnexUserRepository implements UserRepository {
  private readonly knex: Knex;

  private readonly userConverter: UserConverter;
  private readonly userViewConverter: UserViewConverter;
  private readonly userPageConverter: PageConverter<UserViewRecord, User>;
  private readonly loggedInConverter: LoggedInUserConverter;
  private readonly userWithInfoConverter: UserWithInfoConverter;

  public static readonly DEFAULT_PAGE = 1;
  public static readonly PAGE_SIZE = 18;

  constructor(knex: Knex) {
    this.knex = knex;
    this.userConverter = new UserConverter();
    this.userViewConverter = new UserViewConverter();
    this.userPageConverter = new PageConverter<UserViewRecord, User>(
      this.userViewConverter,
    );
    this.loggedInConverter = new LoggedInUserConverter();
    this.userWithInfoConverter = new UserWithInfoConverter();
  }

  public async allPositions(): Promise<string[]> {
    const positionRecords = await this.knex('users')
      .select('position')
      .distinct();

    return positionRecords.map((record) => record.position);
  }

  async all(): Promise<User[]> {
    const userRecords = await this.knex('users');

    return this.mapToBusinesss(userRecords);
  }

  async page(
    page: number,
    pageSize: number,
    sessionUserId: number,
  ): Promise<Page<User>> {
    const queryUserRecords = this.knex('users_view')
      .whereNot('id', sessionUserId)
      .orderBy('is_birthday', 'desc')
      .orderBy('first_name', 'asc')
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
      this.totalPages(totalRecords, pageSize),
    ]);
  }

  private mapToBusinesss(userRecords: UserRecord[]) {
    return userRecords.map((record) => this.userConverter.convert(record));
  }

  private totalPages(
    maybeTotalRecords: Record<string, number> | undefined,
    pageSize: number,
  ): number {
    if (maybeTotalRecords) {
      return Math.ceil(maybeTotalRecords.count / pageSize);
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
      .join({ o: 'offices' }, 'u.office_id', 'o.id')
      .join({ s: 'slack_info' }, 'u.email', 's.email')
      .select(
        { id: 'u.id' },
        'first_name',
        'last_name',
        'u.email',
        { office_name: 'o.name' },
        { partner_id: 'p.id' },
        { partner_name: 'p.name' },
        { partner_logo_url: 'p.logo_url' },
        { partner_description: 'p.description' },
        'position',
        'picture_url',
        { slack_name: 's.name' },
        { slack_id: 's.slack_id' },
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
      .select('l.name', 'l.id')
      .where('ul.user_id', userId);

    return languageRecords.map((record) => ({
      id: record.id,
      name: record.name,
    }));
  }
}
