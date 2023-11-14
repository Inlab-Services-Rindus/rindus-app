import { Partner } from '@/modules/partners/domain/Partner';
import { PartnerRepository } from '@/modules/partners/domain/PartnerRepository';

export async function getPartnerInfo(
  partnerRepository: PartnerRepository,
  id: string,
): Promise<Partner> {
  return partnerRepository.getInfo(id);
}
