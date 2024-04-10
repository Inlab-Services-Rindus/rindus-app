import { config as dotenvConfig } from 'dotenv';
import { Config, Environment, ProcessVariables } from '@/config/config.type';
import { getLocalConfig } from '@/config/local';
import { getDevelopmentConfig } from '@/config/development';
import { getProductionConfig } from '@/config/production';
import { getCommonConfig } from '@/config/common';

function getConfig(): Config {
  const environment: Environment =
    (process.env.BACKEND_NODE_ENV as Environment) || 'local';

  dotenvConfig();

  const commonConfig = getCommonConfig(
    process.env as unknown as ProcessVariables,
  );
  let envConfig: Partial<Config>;
  switch (environment) {
    case 'development':
      envConfig = getDevelopmentConfig(commonConfig);
      break;
    case 'production':
      envConfig = getProductionConfig(commonConfig);
      break;
    default:
      envConfig = getLocalConfig(commonConfig);
  }

  return {
    ...commonConfig,
    ...envConfig,
  };
}

export function isLiveEnvironment(config: Config) {
  return (
    config.environment === 'development' || config.environment === 'production'
  );
}

export const config = getConfig();
