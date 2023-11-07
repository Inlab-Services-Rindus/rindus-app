import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('slack_info', function (table) {
    table.increments();
    table.string('name').notNullable();
    table.string('slack_id').notNullable();
    table.string('email').notNullable();
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('slack_info');
}
