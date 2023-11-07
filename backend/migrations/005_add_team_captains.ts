import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('team_captains', function (table) {
    table.increments();
    table.integer('user_id').unsigned().notNullable();
    table.foreign('user_id').references('users.id').onDelete('cascade');
    table.integer('partner_id').unsigned().notNullable();
    table.foreign('partner_id').references('partners.id').onDelete('cascade');
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('team_captains');
}
