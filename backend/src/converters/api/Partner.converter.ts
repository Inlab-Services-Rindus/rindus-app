import { Converter } from '@/converters/Converter';
import { IndexPartner, PartnersIndex } from '@/models/api/partners/Index';
import { Partner as BusinessPartner } from '@/models/business/Partner';
import { Partner as ApiPartner } from '@/models/api/Partner';
import { Captain, PartnerProfile } from '@/models/api/partners/Show';
import { PartnerMembers as BusinessPartnerMembers } from '@/models/business/Partner';
import { PartnerMembers as ApiPartnerMembers } from '@/models/api/partners/Show';
import { Member as BusinessMember } from '@/models/business/Partner';
import { Member as ApiMember } from '@/models/api/partners/Show';
import { UserConverter } from '@/converters/api/User.converter';

export class PartnersIndexConverter
  implements Converter<BusinessPartner[], PartnersIndex>
{
  private readonly indexPartnerConverter: IndexPartnerConverter;

  constructor() {
    this.indexPartnerConverter = new IndexPartnerConverter();
  }

  convert(source: BusinessPartner[]): PartnersIndex {
    return source.map((businessPartner) =>
      this.indexPartnerConverter.convert(businessPartner),
    );
  }
}

class IndexPartnerConverter
  implements Converter<BusinessPartner, IndexPartner>
{
  private readonly partnerConveter: PartnerConverter;

  constructor() {
    this.partnerConveter = new PartnerConverter();
  }

  convert(source: BusinessPartner): IndexPartner {
    return this.partnerConveter.convert(source);
  }
}

export class PartnerMembersConverter
  implements Converter<BusinessPartnerMembers, ApiPartnerMembers>
{
  private readonly memberConverter: MemberConverter;

  constructor() {
    this.memberConverter = new MemberConverter();
  }

  convert(source: BusinessPartnerMembers): ApiPartnerMembers {
    return {
      members: source.members.map((member) =>
        this.memberConverter.convert(member),
      ),
      captains: source.captains.map((member) =>
        this.memberConverter.convert(member),
      ),
    };
  }
}

export class CaptainConverter implements Converter<BusinessMember, Captain> {
  private readonly userConverter: UserConverter;

  constructor() {
    this.userConverter = new UserConverter();
  }

  convert(source: BusinessMember): Captain {
    return {
      ...this.userConverter.convert(source),
      position: source.position,
    };
  }
}

export class MemberConverter implements Converter<BusinessMember, ApiMember> {
  private readonly captainConverter: CaptainConverter;

  constructor() {
    this.captainConverter = new CaptainConverter();
  }

  convert(source: BusinessMember): ApiMember {
    return {
      ...this.captainConverter.convert(source),
      isCaptain: source.isTeamCaptain,
    };
  }
}

export class PartnerProfileConverter
  implements Converter<BusinessPartner, PartnerProfile>
{
  private readonly partnerConveter: PartnerConverter;

  constructor() {
    this.partnerConveter = new PartnerConverter();
  }

  convert(source: BusinessPartner): PartnerProfile {
    return {
      ...this.partnerConveter.convert(source),
      description: source.description,
    };
  }
}

class PartnerConverter implements Converter<BusinessPartner, ApiPartner> {
  convert(source: BusinessPartner): ApiPartner {
    return {
      id: source.id,
      name: source.name,
      logoUrl: source.logoUrl,
    };
  }
}
