import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', function (table) {
    table.increments();
    table.string('first_name').notNullable();
    table.string('ascii_first_name').notNullable();
    table.string('last_name');
    table.string('ascii_last_name');
    table.string('email').notNullable().unique();
    table.string('picture_url');
    table.integer('office_id').unsigned().notNullable();
    table.foreign('office_id').references('offices.id').onDelete('cascade');
    table.integer('partner_id').unsigned().notNullable();
    table.foreign('partner_id').references('partners.id').onDelete('cascade');
    table.string('position').notNullable();
    table.string('birthday');
    table.timestamps(false, true);
  });

  await knex.schema.createTable('users_languages', function (table) {
    table.increments();
    table.integer('user_id').unsigned().notNullable();
    table.foreign('user_id').references('users.id').onDelete('cascade');
    table.integer('language_id').unsigned().notNullable();
    table.foreign('language_id').references('languages.id').onDelete('cascade');
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users_languages');
  await knex.schema.dropTable('users');
}
