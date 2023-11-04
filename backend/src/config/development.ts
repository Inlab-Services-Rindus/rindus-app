import { Config } from '@/config/config.type';

export const getDevelopmentConfig = (
  commonConfig: Config,
): Partial<Config> => ({
  cors: {
    ...commonConfig.cors,
    origin: 'https://app.rindus.de',
  },
});
