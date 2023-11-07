import { Converter } from '@/converters/Converter';
import {
  PartnerRecord,
  WithPartnerRecord,
} from '@/models/service/database/PartnerRecord';
import { Partner, PartnerMembers } from '@/models/business/Partner';
import { config } from '@/config';
import { UserRecord } from '@/models/service/database/UserRecord';
import { UserConverter } from '@/converters/service/UserRecord.converter';

export class PartnerRecordConverter
  implements Converter<PartnerRecord, Partner>
{
  convert(source: PartnerRecord): Partner {
    return {
      id: source.id,
      name: source.name,
      logoUrl: `${config.app.url}${source.logo_url}`,
    };
  }
}

export class PartnerMembersConverter
  implements Converter<[UserRecord[], UserRecord[]], PartnerMembers>
{
  private readonly userConverter: UserConverter;

  constructor() {
    this.userConverter = new UserConverter();
  }

  convert(source: [UserRecord[], UserRecord[]]): PartnerMembers {
    const [memberRecords, captainRecords] = source;
    return {
      members: memberRecords.map((userRecord) =>
        this.userConverter.convert(userRecord),
      ),
      captains: captainRecords.map((userRecord) =>
        this.userConverter.convert(userRecord),
      ),
    };
  }
}

export class WithPartnerRecordConverter
  implements Converter<Partial<WithPartnerRecord>, Partner | undefined>
{
  private readonly partnerRecordConverter: PartnerRecordConverter;

  constructor() {
    this.partnerRecordConverter = new PartnerRecordConverter();
  }

  convert(source: Partial<WithPartnerRecord>): Partner | undefined {
    if (
      !source.partner_id ||
      !source.partner_name ||
      !source.partner_logo_url
    ) {
      return undefined;
    }

    return this.partnerRecordConverter.convert({
      id: source.partner_id,
      name: source.partner_name,
      logo_url: source.partner_logo_url,
    });
  }
}
