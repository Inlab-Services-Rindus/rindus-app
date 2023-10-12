import { config as dotenvConfig } from 'dotenv';
import { Config, Environment, ProcessVariables } from '@/config/config.type';
import { localConfig } from '@/config/local';
import { developmentConfig } from '@/config/development';
import { productionConfig } from '@/config/production';
import { getCommonConfig } from '@/config/common';

function getConfig(): Config {
  const environment: Environment =
    (process.env.NODE_ENV as Environment) || 'local';

  dotenvConfig();

  let envConfig: Partial<Config>;
  switch (environment) {
    case 'development':
      envConfig = developmentConfig;
      break;
    case 'production':
      envConfig = productionConfig;
      break;
    default:
      envConfig = localConfig;
  }

  return {
    ...getCommonConfig(process.env as unknown as ProcessVariables),
    ...envConfig,
  };
}

export function isLiveEnvironment(config: Config) {
  return (
    config.environment === 'development' || config.environment === 'production'
  );
}

export const config = getConfig();
