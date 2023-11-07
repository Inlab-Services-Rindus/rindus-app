import { parsePersonioJSONFile } from '@seeds/helper';
import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('team_captains').del();

  const items = parsePersonioJSONFile().data.items;

  await items
    .map((employeeData) => employeeData.data)
    .reduce(
      async (acc, item) => {
        const userEmail = item.email;
        const teamCaptainRaw = item.dynamic_1298673;
        const teamCaptainEmail = teamCaptainRaw.split('|').at(1)?.trim();

        return resolveToCaptainIdAndPartnerId(
          knex,
          await acc,
          userEmail,
          teamCaptainEmail ?? '',
        );
      },
      Promise.resolve([] as { user_id: number; partner_id: number }[]),
    )
    .then(async (data) => await knex('team_captains').insert(data));
}

async function resolveToCaptainIdAndPartnerId(
  knex: Knex,
  acc: { user_id: number; partner_id: number }[],
  userEmail: string,
  teamCaptainEmail: string,
) {
  const maybeTeamCaptain = await knex('users')
    .where('email', teamCaptainEmail)
    .first();
  const maybePartnerId = (
    await knex('users').select('partner_id').where('email', userEmail).first()
  )?.partner_id;

  if (maybeTeamCaptain && maybePartnerId) {
    const isThereAssignation = acc.some(
      (assignation) =>
        assignation.user_id === maybeTeamCaptain.id &&
        assignation.partner_id === maybePartnerId,
    );

    if (!isThereAssignation) {
      return acc.concat({
        user_id: maybeTeamCaptain.id,
        partner_id: maybePartnerId,
      });
    }
  }

  return acc;
}
