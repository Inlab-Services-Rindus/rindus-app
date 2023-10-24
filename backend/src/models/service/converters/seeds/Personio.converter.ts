import { Insertable, isEmpty } from '@/helpers/RecordConverterHelper';
import { Converter } from '@/models/Converter';
import { UserRecord } from '@/models/service/UserRecord';
import { Employee as PersonioEmployee } from '@/models/service/seeds/Personio';

interface ReferencedData {
  office_id: number;
  partner_id: number | undefined;
}

export class PersonioEmployeeConverter
  implements
    Converter<
      PersonioEmployee,
      (_data: ReferencedData) => Insertable<UserRecord>
    >
{
  convert(source: PersonioEmployee) {
    const birthday = source.dynamic_87778;

    return (references: ReferencedData) => ({
      first_name: source.first_name,
      last_name: source.last_name,
      email: source.email,
      picture_url: source.profile_picture_url,
      birthday: isEmpty(birthday) ? undefined : birthday,
      position: source.position,
      ...references,
    });
  }
}

export class EmployeeLanguagesConverter
  implements Converter<PersonioEmployee, string[]>
{
  convert(source: PersonioEmployee): string[] {
    return source.dynamic_1300584.split(',').map((lang) => lang.trim());
  }
}

export const IT_PREFIX = 'IT';

export function sanitisePartner(departmentId: string): string {
  return departmentId.replace(`${IT_PREFIX} `, '');
}

export function filterPartners(departmentId: string): boolean {
  return departmentId.startsWith(IT_PREFIX);
}
