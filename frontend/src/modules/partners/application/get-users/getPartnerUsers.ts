import { PartnerRepository } from '@/modules/partners/domain/PartnerRepository';
import { PartnerUsers } from '@/modules/partners/domain/PartnerUsers';

export async function getPartnerUsers(
  partnerRepository: PartnerRepository,
  id: number,
): Promise<PartnerUsers> {
  return partnerRepository.getUsers(id);
}
