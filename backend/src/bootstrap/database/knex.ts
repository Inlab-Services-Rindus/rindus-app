import { Knex } from 'knex';

import { config } from '@/config';

export const knexConfig: Knex.Config = {
  client: 'pg',
  connection: {
    host: config.database.host,
    database: config.database.name,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    ssl:
      config.environment === 'production' ||
      config.environment === 'development',
  },
  pool: {
    min: 2,
    max: 10,
  },
};

// TODO: Avoid relative path
export const TestDatabaseFileName = './integration-db.sqlite';

export const testKnexConfig: Knex.Config = {
  client: 'sqlite3',
  useNullAsDefault: true,
  // Uncomment to debug Knex queries
  // debug: true,
  connection: {
    filename: TestDatabaseFileName,
  },
};
