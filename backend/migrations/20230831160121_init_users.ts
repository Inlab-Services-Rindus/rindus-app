import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', function (table) {
    table.increments();
    table.string('first_name').notNullable();
    table.string('last_name');
    table.string('email').unique().notNullable();
    table.string('profile_picture_url');
    table.string('office_id');
    table.string('department_id');
    table.string('position');
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}
