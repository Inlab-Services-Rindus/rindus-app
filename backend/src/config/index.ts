import { config as dotenvConfig } from 'dotenv';
import { Config, Environment, ProcessVariables } from '@/config/config.type';
import { developmentConfig } from '@/config/development';
import { productionConfig } from '@/config/production';
import { getCommonConfig } from '@/config/common';

function getConfig(): Config {
  const environment: Environment =
    (process.env.NODE_ENV as Environment) || 'development';

  dotenvConfig();

  let envConfig = developmentConfig;
  if (environment === 'production') {
    envConfig = productionConfig;
  }

  return {
    ...getCommonConfig(process.env as unknown as ProcessVariables),
    ...envConfig,
  };
}

export const config = getConfig();
