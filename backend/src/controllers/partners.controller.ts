import { PartnerRepository } from '@/repository/partner.repository';
import { Request, Response } from 'express';

export class PartnersController {
  private readonly partnerRepository: PartnerRepository;

  constructor(partnerRepository: PartnerRepository) {
    this.partnerRepository = partnerRepository;
  }

  public async index(_request: Request, response: Response) {
    const partners = await this.partnerRepository.all();

    return response.send(partners);
  }
}
