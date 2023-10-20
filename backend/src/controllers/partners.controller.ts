import { Request, Response } from 'express';

import { PartnerPrograms } from '@/programs/partner.programs';

export class PartnersController {
  private readonly partnerPrograms: PartnerPrograms;

  constructor(partnerPrograms: PartnerPrograms) {
    this.partnerPrograms = partnerPrograms;
  }

  public async index(_request: Request, response: Response) {
    const partners = await this.partnerPrograms.index();

    return response.send(partners);
  }
}
