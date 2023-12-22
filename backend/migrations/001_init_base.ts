import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('languages', function (table) {
    table.increments();
    table.string('name').notNullable();
    table.timestamps(false, true);
  });

  await knex.schema.createTable('offices', function (table) {
    table.increments();
    table.string('name').notNullable();
    table.timestamps(false, true);
  });

  await knex.schema.createTable('sessions', function (table) {
    table.string('sid').primary();
    table.json('sess').notNullable();
    table.timestamp('expired').notNullable().index();
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('languages');
  await knex.schema.dropTable('offices');
  await knex.schema.dropTable('sessions');
}
