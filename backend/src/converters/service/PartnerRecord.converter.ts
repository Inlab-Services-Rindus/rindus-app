import { Converter } from '@/converters/Converter';
import {
  PartnerRecord,
  WithPartnerRecord,
} from '@/models/service/database/PartnerRecord';
import { Partner, PartnerMembers } from '@/models/business/Partner';
import { config } from '@/config';
import { UserViewRecord } from '@/models/service/database/UserRecord';
import { UserViewConverter } from '@/converters/service/UserRecord.converter';

export class PartnerRecordConverter
  implements Converter<PartnerRecord, Partner>
{
  convert(source: PartnerRecord): Partner {
    return {
      id: source.id,
      name: source.name,
      logoUrl: `${config.app.url}${source.logo_url}`,
      description: source.description,
    };
  }
}

export class PartnerMembersConverter
  implements Converter<[UserViewRecord[], UserViewRecord[]], PartnerMembers>
{
  private readonly userViewConverter: UserViewConverter;

  constructor() {
    this.userViewConverter = new UserViewConverter();
  }

  convert(source: [UserViewRecord[], UserViewRecord[]]): PartnerMembers {
    const [memberRecords, captainRecords] = source;
    return {
      members: memberRecords.map((userRecord) =>
        this.userViewConverter.convert(userRecord),
      ),
      captains: captainRecords.map((userRecord) =>
        this.userViewConverter.convert(userRecord),
      ),
    };
  }
}

export class WithPartnerRecordConverter
  implements Converter<WithPartnerRecord, Partner>
{
  private readonly partnerRecordConverter: PartnerRecordConverter;

  constructor() {
    this.partnerRecordConverter = new PartnerRecordConverter();
  }

  convert(source: WithPartnerRecord): Partner {
    return this.partnerRecordConverter.convert({
      id: source.partner_id,
      name: source.partner_name,
      logo_url: source.partner_logo_url,
      description: source.partner_description,
    });
  }
}
