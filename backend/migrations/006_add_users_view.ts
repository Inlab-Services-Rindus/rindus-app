import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(
    "CREATE VIEW users_view AS SELECT *, birthday = TO_CHAR(CURRENT_DATE, 'Mon DD') as is_birthday FROM users",
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropView('users_view');
}
