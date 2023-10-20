import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('partners', function (table) {
    table.increments();
    table.string('name').notNullable();
    table.string('picture_url');
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('partners');
}
