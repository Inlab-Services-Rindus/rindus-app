import { Request, Response } from 'express';

import { PartnersIndexConverter } from '@/converters/api/Partner.converter';
import { PartnerRepository } from '@/repository/partner.repository';

export class PartnersController {
  private readonly partnerRepository: PartnerRepository;

  private readonly partnersIndexConverter: PartnersIndexConverter;

  constructor(partnerRepository: PartnerRepository) {
    this.partnerRepository = partnerRepository;
    this.partnersIndexConverter = new PartnersIndexConverter();
  }

  public async index(_request: Request, response: Response) {
    const partners = await this.partnerRepository.all();
    const index = this.partnersIndexConverter.convert(partners);

    return response.send(index);
  }
}
