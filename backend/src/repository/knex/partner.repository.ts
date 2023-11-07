import { Knex } from 'knex';

import { Partner, PartnerMembers } from '@/models/business/Partner';
import { PartnerRepository } from '@/repository/partner.repository';
import { PartnerRecord } from '@/models/service/database/PartnerRecord';
import {
  PartnerMembersConverter,
  PartnerRecordConverter,
} from '@/converters/service/PartnerRecord.converter';

export class KnexPartnerRepository implements PartnerRepository {
  private readonly knex: Knex;

  private readonly partnerConverter: PartnerRecordConverter;
  private readonly partnerMembersConverter: PartnerMembersConverter;

  constructor(knex: Knex) {
    this.knex = knex;
    this.partnerConverter = new PartnerRecordConverter();
    this.partnerMembersConverter = new PartnerMembersConverter();
  }

  public async members(id: number): Promise<PartnerMembers | undefined> {
    const records = await this.knex({ u: 'users' })
      .select('*')
      .where('u.partner_id', id);

    return this.partnerMembersConverter.convert(records);
  }

  public async findById(id: number): Promise<Partner | undefined> {
    const maybeRecord = await this.knex<PartnerRecord>('partners')
      .select('id', 'name', 'logo_url')
      .where('id', id)
      .first();

    return maybeRecord ? this.partnerConverter.convert(maybeRecord) : undefined;
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
