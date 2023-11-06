import { Converter } from '@/converters/Converter';
import { IndexPartner, PartnersIndex } from '@/models/api/partners/Index';
import { Partner as BusinessPartner } from '@/models/business/Partner';

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
  convert(source: BusinessPartner): IndexPartner {
    return {
      id: source.id,
      name: source.name,
      logoUrl: source.logoUrl,
    };
  }
}
