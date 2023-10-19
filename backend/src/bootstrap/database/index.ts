import knex, { Knex } from 'knex';

import { knexConfig, testKnexConfig } from '@/bootstrap/database/knex';

function connect(config: Knex.Config): Knex {
  return knex(config);
}

export function connectDatabase(): Knex {
  return connect(knexConfig);
}

export function connectTestDatabase(): Knex {
  return connect(testKnexConfig);
}
