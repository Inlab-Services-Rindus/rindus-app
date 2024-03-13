import { Insertable, isEmpty, sanitise } from '@/helpers/RecordConverterHelper';
import { Converter } from '@/converters/Converter';
import { UserRecord } from '@/models/service/database/UserRecord';
import { Employee as PersonioEmployee } from '@/models/service/seeds/Personio';
import { PartnerRecord } from '@/models/service/database/PartnerRecord';

interface ReferencedData {
  office_id: number;
  partner_id: number;
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
      ascii_first_name: sanitise(source.first_name),
      last_name: source.last_name,
      ascii_last_name: sanitise(source.last_name),
      email: source.email,
      picture_url: `https://avatar-service-platform.personio.de/${source.first_name.charAt(
        0,
      )}${source.last_name?.charAt(0) ?? ''}`,
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

  private static DESCRIPTIONS: { [x: string]: string } = {
    douglas: "With over 2,000 stores, leader of Europe's beauty care sector.",
    stroer:
      'Germany’s leading digital multi-channel media firm, provider of integrated marketing solutions.',
    sonnen:
      'Top German solar battery manufacturer merging renewable energy storage and home automation.',
    canda:
      'Founded in 1841, family-owned C&A provides affordable, ready-to-wear clothing for everyday consumers.',
    auxmoney:
      'Auxmoney is the leading FinTech in Germany for online peer-to-peer credits.',
    obi: 'OBI is the leading do-it-yourself store for building supplies in Germany, Austria.',
    lps: 'Technology leaders with 15 years of expertise in managing coalition loyalty programs in travel and transportation.',
  };

  convert(source: string): Insertable<PartnerRecord> | undefined {
    if (!this.isPartner(source)) {
      return undefined;
    }

    const partnerName = this.sanitiseDepartmentId(source).trim();
    const sanitisedPartnerName = this.sanitisePartnerName(partnerName);
    const description =
      PersonioEmployeePartnerConverter.DESCRIPTIONS[sanitisedPartnerName];

    return {
      name: partnerName,
      logo_url: this.partnerLogoUrl(sanitisedPartnerName),
      description: description,
    };
  }

  public sanitiseDepartmentId(departmentId: string): string {
    return departmentId.replace(
      `${PersonioEmployeePartnerConverter.IT_PREFIX} `,
      '',
    );
  }

  private sanitisePartnerName(partnerName: string) {
    return partnerName
      .toLocaleLowerCase()
      .replace(/ /g, '-')
      .replace(/ö/g, 'o')
      .replace(/&/g, 'and')
      .replace(/loyalty-partner-solutions/g, 'lps');
  }

  private partnerLogoUrl(partnerName: string): string {
    return `/images/partners/${partnerName}.jpg`;
  }

  private isPartner(departmentId: string): boolean {
    return departmentId.startsWith(PersonioEmployeePartnerConverter.IT_PREFIX);
  }
}
