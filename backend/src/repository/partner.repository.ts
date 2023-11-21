import { Partner, PartnerMembers } from '@/models/business/Partner';

export interface PartnerRepository {
  all(): Promise<Partner[]>;
  findById(id: number): Promise<Partner | undefined>;
  members(id: number): Promise<PartnerMembers | undefined>;
}
