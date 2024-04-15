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
    const [memberRecords, captainRecords] = await Promise.all([
      this.knex({ u: 'employees_view' }).select('*').where('u.partner_id', id),
      this.knex({ tc: 'team_captains' })
        .join({ u: 'employees_view' }, 'tc.employee_id', 'u.id')
        .select('u.*')
        .where('tc.partner_id', id),
    ]);

    return this.partnerMembersConverter.convert([
      memberRecords,
      captainRecords,
    ]);
  }

  public async findById(id: number): Promise<Partner | undefined> {
    const maybeRecord = await this.knex<PartnerRecord>('partners')
      .where('id', id)
      .first();

    return maybeRecord ? this.partnerConverter.convert(maybeRecord) : undefined;
  }

  public async all(): Promise<Partner[]> {
    const partnerRecords = await this.knex<PartnerRecord>('partners');

    return partnerRecords.map((record) =>
      this.partnerConverter.convert(record),
    );
  }
}
