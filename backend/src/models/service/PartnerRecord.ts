import { Enumerable, Identifiable } from '@/models/service/Record';

export interface PartnerRecord extends Identifiable, Enumerable {
  logo_url: string;
}
