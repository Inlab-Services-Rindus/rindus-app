import { Request, Response } from 'express';

import {
  PartnerMembersConverter,
  PartnerProfileConverter,
  PartnersIndexConverter,
} from '@/converters/api/Partner.converter';
import { PartnerRepository } from '@/repository/partner.repository';
import { toRecordId } from '@/helpers/RecordConverterHelper';

export class PartnersController {
  private readonly partnerRepository: PartnerRepository;

  private readonly partnersIndexConverter: PartnersIndexConverter;
  private readonly partnerProfileConverter: PartnerProfileConverter;
  private readonly partnerMembersConverter: PartnerMembersConverter;

  constructor(partnerRepository: PartnerRepository) {
    this.partnerRepository = partnerRepository;
    this.partnersIndexConverter = new PartnersIndexConverter();
    this.partnerProfileConverter = new PartnerProfileConverter();
    this.partnerMembersConverter = new PartnerMembersConverter();
  }

  public async index(_request: Request, response: Response) {
    const partners = await this.partnerRepository.all();
    const index = this.partnersIndexConverter.convert(partners);

    return response.send(index);
  }

  public async show(request: Request, response: Response) {
    const partnerIdParam = request.params.partnerId;

    const maybePartnerId = toRecordId(partnerIdParam);

    if (maybePartnerId) {
      const maybePartner =
        await this.partnerRepository.findById(maybePartnerId);

      if (maybePartner) {
        const user = this.partnerProfileConverter.convert(maybePartner);
        return response.send(user);
      }
    }

    return response.sendStatus(404);
  }

  public async members(request: Request, response: Response) {
    const partnerIdParam = request.params.partnerId;

    const maybePartnerId = toRecordId(partnerIdParam);

    if (maybePartnerId) {
      const maybeMembers = await this.partnerRepository.members(maybePartnerId);

      if (maybeMembers) {
        const user = this.partnerMembersConverter.convert(maybeMembers);
        return response.send(user);
      }
    }

    return response.sendStatus(404);
  }
}
