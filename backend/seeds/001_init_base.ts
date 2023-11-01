import { Knex } from 'knex';

import { parsePersonioJSONFile } from '@seeds/helper';
import { OfficeRecord } from '@/models/service/database/OfficeRecord';
import { distinctRecords } from '@/helpers/RecordConverterHelper';
import { EmployeeLanguagesConverter } from '@/converters/service/seeds/Personio.converter';

export async function seed(knex: Knex): Promise<void> {
  await knex('languages').del();
  await knex('offices').del();
  await knex('partners').del();

  const personioData = parsePersonioJSONFile();
  const languagesConverter = new EmployeeLanguagesConverter();

  const items = personioData.data.items;
  const offices = distinctRecords(
    items.map((employeeData) => employeeData.data.office_id),
  );
  const languages = distinctRecords(
    items.reduce((acc, employeeData) => {
      const employeeLanguages = languagesConverter.convert(employeeData.data);
      return acc.concat(employeeLanguages);
    }, [] as string[]),
  );

  await knex<OfficeRecord>('languages').insert(languages);
  await knex<OfficeRecord>('offices').insert(offices);
}
