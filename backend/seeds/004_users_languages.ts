import { Knex } from 'knex';

import { parsePersonioJSONFile } from '@seeds/helper';
import { Employee } from '@/models/service/seeds/Personio';
import { UsersLanguagesRecord } from '@/models/service/database/UsersLanguagesRecord';
import { EmployeeLanguagesConverter } from '@/converters/service/seeds/Personio.converter';

export async function seed(knex: Knex): Promise<void> {
  await knex('users_languages').del();
  const personioData = parsePersonioJSONFile();
  const languagesConverter = new EmployeeLanguagesConverter();
  const processEmployeeLanguages = employeeLanguagesProcessor(
    knex,
    languagesConverter,
  );
  const employeesLanguages = await Promise.all(
    personioData.data.items
      .map((employeeData) => employeeData.data)
      .filter(
        (data) =>
          data.email.includes('@rindus.de') ||
          data.email.includes('@rinduss.de') ||
          data.email.includes('@mail.de'),
      )
      .map(async (employee) => await processEmployeeLanguages(employee)),
  );
  await knex<UsersLanguagesRecord>('users_languages').insert(
    employeesLanguages.flat(),
  );
}

const employeeLanguagesProcessor =
  (knex: Knex, converter: EmployeeLanguagesConverter) =>
  async (personioEmployee: Employee): Promise<UsersLanguagesRecord[]> => {
    const userId = await findUserId(knex, personioEmployee.email);
    const languages = converter.convert(personioEmployee);

    return processLanguages(knex, userId, languages);
  };

async function findUserId(knex: Knex, email: string) {
  const maybeUser = await knex('users').where('email', email).first();

  if (!maybeUser) {
    console.log('===========adio', email);
  }

  return maybeUser ? maybeUser.id : 0;
}

async function processLanguages(
  knex: Knex,
  userId: number,
  languages: string[],
) {
  return languages.reduce(
    async (acc, lang) => {
      const maybeLanguage = await knex('languages').where('name', lang).first();
      const accumulator = await acc;

      return maybeLanguage
        ? accumulator.concat({ user_id: userId, language_id: maybeLanguage.id })
        : accumulator;
    },
    Promise.resolve([] as UsersLanguagesRecord[]),
  );
}
