import { Knex } from 'knex';

import { User } from '@/models/business/User';
import { UserRepository } from '@/repository/user.repository';
import {
  UserRecord,
  WithOffice,
  WithPartner,
} from '@/models/service/UserRecord';
import { ExtendedUserRecordConverter } from '@/models/service/converters/UserRecord.converter';

export class KnexUserRepository implements UserRepository {
  private readonly knex: Knex;
  private readonly converter: ExtendedUserRecordConverter;

  constructor(knex: Knex) {
    this.knex = knex;
    this.converter = new ExtendedUserRecordConverter();
  }

  public async findUserByEmail(email: string): Promise<User | undefined> {
    const userRecord = await this.selectUsers().where('email', email).first();

    return this.toBusiness(userRecord);
  }

  public async findUserById(id: string): Promise<User | undefined> {
    const userRecord = await this.selectUsers()
      .where('u.id', Number(id))
      .first();

    return this.toBusiness(userRecord);
  }

  public async all(): Promise<User[]> {
    const userRecords = await this.selectUsers();

    return userRecords.map((record) => this.converter.convert(record));
  }

  private selectUsers() {
    return this.knex<UserRecord & WithOffice & WithPartner>({ u: 'users' })
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
      );
  }

  private toBusiness(
    userRecord: (UserRecord & WithOffice & WithPartner) | undefined,
  ) {
    return userRecord ? this.converter.convert(userRecord) : undefined;
  }
}
