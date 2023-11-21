import { Knex } from 'knex';

import { parsePersonioJSONFile } from '@seeds/helper';
import { PartnerRecord } from '@/models/service/database/PartnerRecord';
import { Insertable, distinctRecords } from '@/helpers/RecordConverterHelper';
import { PersonioEmployeePartnerConverter } from '@/converters/service/seeds/Personio.converter';

export async function seed(knex: Knex): Promise<void> {
  await knex('partners').del();

  const personioData = parsePersonioJSONFile();

  const partnerConverter = new PersonioEmployeePartnerConverter();
  const items = personioData.data.items;
  const partners = distinctRecords(
    items.map((employeeData) => employeeData.data.department_id),
  ).reduce((acc, enumerable) => {
    const partnerName = enumerable.name;
    const maybePartner = partnerConverter.convert(partnerName);

    return maybePartner ? acc.concat(maybePartner) : acc;
  }, [] as Insertable<PartnerRecord>[]);

  await knex<PartnerRecord>('partners').insert(partners.concat({
    name: 'Rindus',
    logo_url: '/images/rindus.jpg',
    description: ''
  }));
}
