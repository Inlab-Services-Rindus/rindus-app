import { Insertable, isEmpty } from '@/helpers/RecordConverterHelper';
import { Converter } from '@/models/Converter';
import { UserRecord } from '@/models/service/UserRecord';
import { Employee as PersonioEmployee } from '@/models/service/seeds/Personio';
import { PartnerRecord } from '@/models/service/PartnerRecord';

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

export class PersonioEmployeePartnerConverter
  implements Converter<string, Insertable<PartnerRecord> | undefined>
{
  private static readonly IT_PREFIX = 'IT';

  convert(source: string): Insertable<PartnerRecord> | undefined {
    if (!this.isPartner(source)) {
      return undefined;
    }

    const partnerName = this.sanitisePartner(source).trim();

    return {
      name: partnerName,
      logo_url: this.partnerLogoUrl(partnerName),
    };
  }

  public sanitisePartner(departmentId: string): string {
    return departmentId.replace(
      `${PersonioEmployeePartnerConverter.IT_PREFIX} `,
      '',
    );
  }

  private partnerLogoUrl(partnerName: string): string {
    return `/images/partners/${partnerName
      .toLocaleLowerCase()
      .replace(/ /g, '-')
      .replace(/ö/g, 'o')}.svg`;
  }

  private isPartner(departmentId: string): boolean {
    return departmentId.startsWith(PersonioEmployeePartnerConverter.IT_PREFIX);
  }
}
