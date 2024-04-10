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
  UserViewRecord,
} from '@/models/service/database/UserRecord';
import {
  LoggedInUserConverter,
  UserViewConverter,
  UserWithInfoConverter,
} from '@/converters/service/UserRecord.converter';
import { Page } from '@/models/business/Pagination';
import { PageConverter } from '@/converters/service/Pagination.converter';
import { Language } from '@/models/business/Language';

export class KnexUserRepository implements UserRepository {
  private readonly knex: Knex;

  private readonly userViewConverter: UserViewConverter;
  private readonly userPageConverter: PageConverter<UserViewRecord, User>;
  private readonly loggedInConverter: LoggedInUserConverter;
  private readonly userWithInfoConverter: UserWithInfoConverter;

  public static readonly DEFAULT_PAGE = 1;
  public static readonly PAGE_SIZE = 18;

  constructor(knex: Knex) {
    this.knex = knex;
    this.userViewConverter = new UserViewConverter();
    this.userPageConverter = new PageConverter<UserViewRecord, User>(
      this.userViewConverter,
    );
    this.loggedInConverter = new LoggedInUserConverter();
    this.userWithInfoConverter = new UserWithInfoConverter();
  }

  public async allByLanguage(languageId: number): Promise<User[]> {
    const userRecords = await this.knex({ ul: 'employees_languages' })
      .join(
        {
          u: 'employees_view',
        },
        'ul.employee_id',
        'u.id',
      )
      .where('ul.language_id', languageId);

    return this.mapToBusinesss(userRecords);
  }

  public async allPositions(): Promise<string[]> {
    const positionRecords = await this.knex('employees')
      .select('position')
      .distinct();

    return positionRecords.map((record) => record.position);
  }

  async all(): Promise<User[]> {
    const userRecords = await this.knex('employees_view');

    return this.mapToBusinesss(userRecords);
  }

  async page(
    page: number,
    pageSize: number,
    sessionUserId: number,
  ): Promise<Page<User>> {
    const queryUserRecords = this.knex('employees_view')
      .whereNot('id', sessionUserId)
      .orderBy('is_birthday', 'desc')
      .orderBy('ascii_first_name', 'asc')
      .offset((page - 1) * pageSize)
      .limit(pageSize);

    const queryTotalRecords = this.knex('employees')
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

  private mapToBusinesss(userRecords: UserViewRecord[]) {
    return userRecords.map((record) => this.userViewConverter.convert(record));
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
    return this.knex('employees').select('id', 'picture_url');
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
      u: 'employees_view',
    })
      .join({ p: 'partners' }, 'u.partner_id', 'p.id')
      .leftJoin({ s: 'slack_info' }, 'u.id', 's.employee_id')
      .select(
        'u.*',
        { partner_id: 'p.id' },
        { partner_name: 'p.name' },
        { partner_logo_url: 'p.logo_url' },
        { partner_description: 'p.description' },
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
    const languageRecords = await this.knex({ ul: 'employees_languages' })
      .join({ l: 'languages' }, 'ul.language_id', 'l.id')
      .select('l.name', 'l.id')
      .where('ul.employee_id', userId);

    return languageRecords.map((record) => ({
      id: record.id,
      name: record.name,
    }));
  }
}
