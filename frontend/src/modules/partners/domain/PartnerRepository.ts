import { Partner } from '@/modules/partners/domain/Partner';
import { PartnerUsers } from '@/modules/partners/domain/PartnerUsers';

export interface PartnerRepository {
  getAll: () => Promise<Partner[]>;
  getInfo: (id: number) => Promise<Partner>;
  getUsers: (id: number) => Promise<PartnerUsers>;
}
