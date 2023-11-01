import { Knex } from 'knex';

import { Partner } from '@/models/business/Partner';
import { PartnerRepository } from '@/repository/partner.repository';
import { PartnerRecord } from '@/models/service/database/PartnerRecord';
import { PartnerRecordConverter } from '@/converters/service/PartnerRecord.converter';

export class KnexPartnerRepository implements PartnerRepository {
  private readonly knex: Knex;

  private readonly partnerConverter: PartnerRecordConverter;

  constructor(knex: Knex) {
    this.knex = knex;
    this.partnerConverter = new PartnerRecordConverter();
  }

  public async all(): Promise<Partner[]> {
    const partnerRecords = await this.knex<PartnerRecord>('partners').select(
      'id',
      'name',
      'logo_url',
    );

    return partnerRecords.map((record) =>
      this.partnerConverter.convert(record),
    );
  }
}
