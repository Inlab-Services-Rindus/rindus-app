import { Converter } from '@/models/Converter';
import { PartnerRecord } from '@/models/service/PartnerRecord';
import { Partner } from '@/models/business/Partner';
import { fromRecordId } from '@/helpers/RecordConverterHelper';

export class PartnerRecordConverter
  implements Converter<PartnerRecord, Partner>
{
  convert(source: PartnerRecord): Partner {
    return {
      id: fromRecordId(source.id),
      name: source.name,
      logoUrl: source.logo_url,
    };
  }
}
