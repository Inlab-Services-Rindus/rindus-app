import { SlackData } from '@/models/service/seeds/Slack';
import { parseSlackJSONFile } from '@seeds/helper';
import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('slack_info').del();

  const slackData = parseSlackJSONFile();

  // Inserts seed entries
  await knex('slack_info').insert(toSlackDataRecords(slackData));
}

function toSlackDataRecords(slackData: SlackData) {
  return slackData.map((data) => ({
    name: data.name,
    slack_id: data.slackId,
    email: data.email,
  }));
}
