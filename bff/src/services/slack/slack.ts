import { config } from '@/config';
import { authBackend } from '@/services/auth/auth';

interface Member {
  id: string;
  team_id: string;
  name: string;
  deleted: boolean;
  color: string;
  real_name: string;
  tz: string;
  tz_label: string;
  tz_offset: number;
  profile: {
    title: string;
    phone: string;
    skype: string;
    real_name: string;
    real_name_normalized: string;
    display_name: string;
    display_name_normalized: string;
    status_text: string;
    status_emoji: string;
    status_expiration: number;
    avatar_hash: string;
    always_active: boolean;
    first_name: string;
    last_name: string;
    image_24: string;
    image_32: string;
    image_48: string;
    image_72: string;
    image_192: string;
    image_512: string;
    status_text_canonical: string;
    team: string;
  };
  is_admin: boolean;
  is_owner: boolean;
  is_primary_owner: boolean;
  is_restricted: boolean;
  is_ultra_restricted: boolean;
  is_bot: boolean;
  is_app_user: boolean;
  updated: number;
  is_email_confirmed: boolean;
  who_can_share_contact_card: string;
}

interface SlackResponse {
  ok: boolean;
  members: Member[];
  cache_ts: number;
  response_metadata: {
    next_cursor: string;
  };
}

export async function getSlackInfo() {
  const response = await fetch('https://slack.com/api/users.list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.slack.apiToken}`,
    },
  });

  const slackInfos = (await response.json()) as SlackResponse;

  const { access_token, token_type } = await authBackend();

  for (const member of slackInfos.members) {
    await fetch(`${config.api.url}/api/v1/employees/import/slack-info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token_type} ${access_token}`,
      },
      body: JSON.stringify(member),
    });
  }

  return slackInfos;
}
