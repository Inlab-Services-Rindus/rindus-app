import { Knex } from 'knex';

import { USERS_FILE_NAME, parseFromJSONFile } from '@seeds/helper';
import { UserRecord as Employee } from '@/models/service/UserRecord';

export async function seed(knex: Knex): Promise<void> {
  const usersTable = knex('users');
  await usersTable.del();

  const employees = parseFromJSONFile<Employee>(USERS_FILE_NAME);

  await usersTable.insert(employees);
}
