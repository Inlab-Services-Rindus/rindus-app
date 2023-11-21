import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(
    "CREATE VIEW users_view AS SELECT u.*, u.birthday = TO_CHAR(CURRENT_DATE, 'Mon DD') AS is_birthday, (SELECT id FROM team_captains WHERE user_id = u.id LIMIT 1) IS NOT NULL AS is_team_captain FROM users u",
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropView('users_view');
}
