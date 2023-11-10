import { WithOfficeRecord } from '@/models/service/database/OfficeRecord';
import { WithPartnerRecord } from '@/models/service/database/PartnerRecord';
import { Identifiable } from '@/models/service/database/Record';
import { WithSlackInfoRecord } from '@/models/service/database/SlackInfoRecord';
import { Knex } from 'knex';

export interface LoggedInUserRecord extends Identifiable {
  picture_url?: string;
}

export interface UserRecord extends LoggedInUserRecord {
  first_name: string;
  last_name?: string;
  email: string;
  office_id: number;
  partner_id?: number;
  position: string;
  birthday?: string;
}

export interface UserViewRecord extends UserRecord {
  is_birthday: boolean;
}

export type UserProfileQueryRecord = UserRecord &
  Partial<WithPartnerRecord> &
  WithSlackInfoRecord &
  WithOfficeRecord;

declare module 'knex/types/tables' {
  interface Tables {
    users: UserRecord;
    users_composite: Knex.CompositeTableType<
      UserRecord,
      Pick<UserRecord, 'first_name' | 'email' | 'office_id'> &
        Partial<
          Pick<
            UserRecord,
            | 'last_name'
            | 'picture_url'
            | 'office_id'
            | 'partner_id'
            | 'position'
            | 'birthday'
          >
        >,
      Partial<Omit<UserRecord, 'id'>>
    >;
  }
}
