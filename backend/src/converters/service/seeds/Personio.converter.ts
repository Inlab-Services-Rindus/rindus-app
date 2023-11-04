import { Insertable, isEmpty } from '@/helpers/RecordConverterHelper';
import { Converter } from '@/converters/Converter';
import { UserRecord } from '@/models/service/database/UserRecord';
import { Employee as PersonioEmployee } from '@/models/service/seeds/Personio';
import { PartnerRecord } from '@/models/service/database/PartnerRecord';

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
    const rawLanguages = source.dynamic_1300584;
    const sanitisedLanguages = rawLanguages
      .toLowerCase()
      .replace(/,/g, ' ')
      .replace(/\./g, ' ');

    return sanitisedLanguages
      .split(/[ ]+/g)
      .map((lang) => lang.trim())
      .filter((lang) => !isEmpty(lang));
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

    const partnerName = this.sanitiseDepartmentId(source).trim();

    return {
      name: partnerName,
      logo_url: this.partnerLogoUrl(partnerName),
    };
  }

  public sanitiseDepartmentId(departmentId: string): string {
    return departmentId.replace(
      `${PersonioEmployeePartnerConverter.IT_PREFIX} `,
      '',
    );
  }

  private partnerLogoUrl(partnerName: string): string {
    const sanitisedPartnerName = partnerName
      .toLocaleLowerCase()
      .replace(/ /g, '-')
      .replace(/ö/g, 'o')
      .replace(/&/g, 'and')
      .replace(/loyalty-partner-solutions/g, 'lps');

    return `/images/partners/${sanitisedPartnerName}.svg`;
  }

  private isPartner(departmentId: string): boolean {
    return departmentId.startsWith(PersonioEmployeePartnerConverter.IT_PREFIX);
  }
}
