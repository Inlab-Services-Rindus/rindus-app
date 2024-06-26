import { Enumerable, Identifiable } from '@/models/service/database/Record';

export interface PartnerRecord extends Identifiable, Enumerable {
  logo_url: string;
  description: string;
}

export interface WithPartnerRecord {
  partner_id: number;
  partner_name: string;
  partner_logo_url: string;
  partner_description: string;
}
