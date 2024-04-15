import { Insertable } from '@/helpers/RecordConverterHelper';
import { PartnerRecord } from '@/models/service/database/PartnerRecord';

export type Partner = Insertable<PartnerRecord>;
