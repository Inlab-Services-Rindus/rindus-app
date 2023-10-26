import { Knex } from 'knex';

import { LanguageRepository } from '@/repository/language.repository';

export class KnexLanguageRepository implements LanguageRepository {
  private readonly knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  public async userLanguagesById(userId: string): Promise<string[]> {
    const languageRecords = await this.knex<string>({ ul: 'users_languages' })
      .join({ l: 'languages' }, 'ul.language_id', 'l.id')
      .select('l.name')
      .where('user_id', userId);

    return languageRecords.map((record) => record.name);
  }
}
