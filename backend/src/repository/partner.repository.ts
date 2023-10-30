import { Partner } from '@/models/business/Partner';

export interface PartnerRepository {
  all(): Promise<Partner[]>;
}
