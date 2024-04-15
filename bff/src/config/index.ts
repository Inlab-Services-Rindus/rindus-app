import { config as dotenvConfig } from 'dotenv';
import { Config, ProcessVariables } from '@/config/config.type';
import { getCommonConfig } from '@/config/common';

function getConfig(): Config {
  dotenvConfig();

  return getCommonConfig(process.env as unknown as ProcessVariables);
}

export function isLiveEnvironment(config: Config) {
  return (
    config.environment === 'staging' || config.environment === 'production'
  );
}

export const config = getConfig();
