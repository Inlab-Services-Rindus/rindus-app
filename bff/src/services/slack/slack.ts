import { logger } from '@/bootstrap/logger';
import { Config } from '@/config/config.type';
import { Auth } from '@/services/auth/auth';

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
  is_invited_user?: boolean;
}

interface SlackResponse {
  ok: boolean;
  members: Member[];
  cache_ts: number;
  response_metadata: {
    next_cursor: string;
  };
}

export async function createSlackInfo(
  config: Config,
  auth: Auth,
  slackInfos: SlackResponse,
) {
  const { access_token, token_type } = auth;

  for (const member of slackInfos.members ?? []) {
    if (!isValidMember(member)) {
      continue;
    }

    logger.debug('Sending slack info for employee %s', member.name);
    const response = await fetch(
      `${config.api.url}/api/v1/employees/import/slack-info`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token_type} ${access_token}`,
        },
        body: JSON.stringify(member),
      },
    );
    logger.debug(
      'Received response for employee %s - %d',
      member.name,
      response.status,
    );
  }

  return slackInfos;
}
function isValidMember(member: Member) {
  if (member.deleted) {
    logger.debug('Skipping slack info for deleted entry %s', member.name);
    return false;
  }

  if (member.is_invited_user) {
    logger.debug('Skipping slack info for invited user %s', member.name);
    return false;
  }

  if (member.is_bot) {
    logger.debug('Skipping slack info for bot %s', member.name);
    return false;
  }

  return true;
}

export async function updateSlackInfo(
  config: Config,
  auth: Auth,
  slackInfos: SlackResponse,
) {
  const { access_token, token_type } = auth;

  for (const member of slackInfos.members ?? []) {
    if (!isValidMember(member)) {
      continue;
    }
    logger.debug('Sending slack info for employee %s', member.name);
    const response = await fetch(
      `${config.api.url}/api/v1/employees/update/slack-info`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token_type} ${access_token}`,
        },
        body: JSON.stringify(member),
      },
    );
    logger.debug(
      'Received response for employee %s - %d',
      member.name,
      response.status,
    );
  }

  return slackInfos;
}

export async function requestSlackInfo(config: Config): Promise<SlackResponse> {
  const response = await fetch('https://slack.com/api/users.list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.slack.apiToken}`,
    },
  });

  logger.debug('Received status code from slack %d', response.status);

  return response.json();
}
