import { Partner } from '@/modules/partners/domain/Partner';
import { PartnerRepository } from '@/modules/partners/domain/PartnerRepository';

export async function getAllPartners(
  partnerRepository: PartnerRepository,
): Promise<Partner[]> {
  return partnerRepository.getAll();
}
