import { Knex } from 'knex';

import { LanguageRepository } from '@/repository/language.repository';
import { Language } from '@/models/business/Language';

export class KnexLanguageRepository implements LanguageRepository {
  private readonly knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  public async all(): Promise<Language[]> {
    return await this.knex<string>('languages').select('id', 'name');
  }
}
