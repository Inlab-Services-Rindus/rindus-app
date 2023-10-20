import { Knex } from 'knex';

import { PARTNERS_FILE_NAME, parseFromJSONFile } from '@seeds/helper';
import { PartnerRecord as Partner } from '@/models/service/PartnerRecord';

export async function seed(knex: Knex): Promise<void> {
  const partnersTable = knex('partners');
  await partnersTable.del();

  const partners = parseFromJSONFile<Omit<Partner, 'id'>>(PARTNERS_FILE_NAME);

  await partnersTable.insert(partners);
}
