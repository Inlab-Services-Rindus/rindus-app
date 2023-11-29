import { Partner } from '@/modules/partners/domain/Partner';
import { PartnerRepository } from '@/modules/partners/domain/PartnerRepository';

export async function getPartnerInfo(
  partnerRepository: PartnerRepository,
  id: number,
): Promise<Partner> {
  return partnerRepository.getInfo(id);
}
