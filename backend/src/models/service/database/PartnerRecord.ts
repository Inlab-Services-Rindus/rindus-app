import { Enumerable, Identifiable } from '@/models/service/database/Record';

export interface PartnerRecord extends Identifiable, Enumerable {
  logo_url: string;
}
