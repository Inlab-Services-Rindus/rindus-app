import { Identifiable } from '@/models/service/Record';
import { Knex } from 'knex';

export interface UserRecord extends Identifiable {
  first_name: string;
  last_name?: string;
  email: string;
  picture_url?: string;
  office_id: number;
  partner_id?: number;
  position?: string;
  birthday?: string;
}

export interface WithPartner {
  partner_name?: string;
}

export interface WithOffice {
  office_name: string;
}

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
