import { WithPartnerRecord } from '@/models/service/database/PartnerRecord';
import { Identifiable } from '@/models/service/database/Record';
import { WithSlackInfoRecord } from '@/models/service/database/SlackInfoRecord';
import { Knex } from 'knex';

export interface LoggedInUserRecord extends Identifiable {
  picture_url?: string;
}

export interface UserRecord extends LoggedInUserRecord {
  first_name: string;
  ascii_first_name: string;
  last_name?: string;
  ascii_last_name?: string;
  email: string;
  office_id: number;
  partner_id: number;
  position: string;
  birthday?: string;
}

export interface UserViewRecord extends UserRecord {
  is_birthday: boolean;
  is_team_captain: boolean;
}

export type UserProfileQueryRecord = UserViewRecord &
  WithPartnerRecord &
  WithSlackInfoRecord;

declare module 'knex/types/tables' {
  interface Tables {
    users: UserRecord;
    employees_view: UserViewRecord;
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
