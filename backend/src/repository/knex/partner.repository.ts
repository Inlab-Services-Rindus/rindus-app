import { Knex } from 'knex';

import { Partner } from '@/models/business/Partner';
import { PartnerRepository } from '@/repository/partner.repository';
import { PartnerRecord } from '@/models/service/PartnerRecord';

export class KnexPartnerRepository implements PartnerRepository {
  private readonly knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  public async all(): Promise<Partner[]> {
    const partnerRecords = await this.knex<PartnerRecord>('partners').select(
      'id',
      'name',
      'logo_url',
    );

    return partnerRecords.map((record) => this.recordToPartner(record));
  }

  private recordToPartner(partnerRecord: PartnerRecord): Partner {
    return {
      id: partnerRecord.id.toFixed(),
      name: partnerRecord.name,
      logoUrl: partnerRecord.logo_url,
    };
  }
}
