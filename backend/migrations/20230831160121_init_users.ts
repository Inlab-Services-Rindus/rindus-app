import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', function (table) {
    table.increments();
    table.string('personio_id').unique();
    table.string('first_name').notNullable();
    table.string('last_name');
    table.string('email').unique().notNullable();
    table.string('profile_picture_url');
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}
