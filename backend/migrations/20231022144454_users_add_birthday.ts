import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', function (table) {
    table.string('birthday');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', function (table) {
    table.dropColumn('birthday');
  });
}
