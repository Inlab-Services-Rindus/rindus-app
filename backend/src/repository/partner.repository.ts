import { Partner, PartnerMembers } from '@/models/business/Partner';

export interface PartnerRepository {
  all(): Promise<Partner[]>;
  findById(_id: number): Promise<Partner | undefined>;
  members(_id: number): Promise<PartnerMembers | undefined>;
}
