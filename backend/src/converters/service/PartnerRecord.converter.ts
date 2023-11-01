import { Converter } from '@/converters/Converter';
import { PartnerRecord } from '@/models/service/database/PartnerRecord';
import { Partner } from '@/models/business/Partner';
import { config } from '@/config';

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
