import { PartnerRepository } from '@/repository/partner.repository';

export class PartnerPrograms {
  private readonly partnerRepository;

  constructor(partnerRepository: PartnerRepository) {
    this.partnerRepository = partnerRepository;
  }

  public index() {
    return this.partnerRepository.all();
  }
}
