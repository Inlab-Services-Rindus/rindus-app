import { PartnerRepository } from '@/modules/partners/domain/PartnerRepository';
import { PartnerUsers } from '@/modules/partners/domain/PartnerUsers';

export async function getPartnerUsers(
  partnerRepository: PartnerRepository,
  id: string,
): Promise<PartnerUsers> {
  return partnerRepository.getUsers(id);
}
