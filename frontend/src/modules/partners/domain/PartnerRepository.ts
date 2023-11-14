import { Partner } from '@/modules/partners/domain/Partner';
import { PartnerUsers } from '@/modules/partners/domain/PartnerUsers';

export interface PartnerRepository {
  getAll: () => Promise<Partner[]>;
  getInfo: (id: string) => Promise<Partner>;
  getUsers: (id: string) => Promise<PartnerUsers>;
}
