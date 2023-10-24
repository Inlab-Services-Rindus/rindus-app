import { Knex } from 'knex';

import { parsePersonioJSONFile } from '@seeds/helper';
import { PartnerRecord } from '@/models/service/PartnerRecord';
import {
  filterPartners,
  sanitisePartner,
} from '@/models/service/converters/seeds/Personio.converter';
import { distinctRecords } from '@/helpers/RecordConverterHelper';

export async function seed(knex: Knex): Promise<void> {
  await knex('partners').del();

  const personioData = parsePersonioJSONFile();

  const items = personioData.data.items;
  const partners = distinctRecords(
    items
      .map((employeeData) => employeeData.data.department_id)
      .filter(filterPartners)
      .map(sanitisePartner),
  );

  await knex<PartnerRecord>('partners').insert(partners);
}
