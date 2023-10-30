import { Knex } from 'knex';

import { LanguageRepository } from '@/repository/language.repository';
import { Language } from '@/models/business/Language';

export class KnexLanguageRepository implements LanguageRepository {
  private readonly knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  public async userLanguagesById(userId: string): Promise<Language[]> {
    const languageRecords = await this.knex({ ul: 'users_languages' })
      .join({ l: 'languages' }, 'ul.language_id', 'l.id')
      .select('l.name')
      .where('ul.user_id', userId);

    return languageRecords.map((record) => record.name);
  }
}
