import { Knex } from 'knex';

import { parsePersonioJSONFile } from '@seeds/helper';
import {
  PersonioEmployeeConverter,
  sanitisePartner,
} from '@/models/service/converters/seeds/Personio.converter';
import { Employee } from '@/models/service/seeds/Personio';
import { OfficeRecord } from '@/models/service/OfficeRecord';
import { PartnerRecord } from '@/models/service/PartnerRecord';
import { UserRecord } from '@/models/service/UserRecord';
import { Insertable } from '@/helpers/RecordConverterHelper';

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();

  const personioData = parsePersonioJSONFile();

  const converter = new PersonioEmployeeConverter();
  const processEmployeeBaseData = employeeBaseDataProcessor(knex, converter);

  const employees = await Promise.all(
    personioData.data.items
      .map((employeeData) => employeeData.data)
      .map(async (employee) => await processEmployeeBaseData(employee)),
  );

  await knex('users').insert(employees);
}

const employeeBaseDataProcessor =
  (knex: Knex, converter: PersonioEmployeeConverter) =>
  async (personioEmployee: Employee): Promise<Insertable<UserRecord>> => {
    const [officeId, partnerId] = await Promise.all([
      processOffice(knex, personioEmployee.office_id),
      processPartner(knex, personioEmployee.department_id),
    ]);

    return converter.convert(personioEmployee)({
      office_id: officeId,
      partner_id: partnerId,
    });
  };

async function processOffice(knex: Knex, officeId: string) {
  const maybeOffice = await knex<OfficeRecord>('offices')
    .where('name', officeId)
    .first();

  return maybeOffice ? maybeOffice.id : 0;
}

async function processPartner(knex: Knex, partnerId: string) {
  const maybePartner = await knex<PartnerRecord>('partners')
    .where('name', sanitisePartner(partnerId))
    .first();

  return maybePartner?.id;
}
