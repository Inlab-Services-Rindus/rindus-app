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

  const commonConfig = getCommonConfig(
    process.env as unknown as ProcessVariables,
  );
  let envConfig: Partial<Config>;
  switch (environment) {
    case 'development':
      envConfig = developmentConfig(commonConfig);
      break;
    case 'production':
      envConfig = productionConfig(commonConfig);
      break;
    default:
      envConfig = localConfig(commonConfig);
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
