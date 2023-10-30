import { Config } from '@/config/config.type';

export const developmentConfig = (commonConfig: Config): Partial<Config> => ({
  cors: {
    ...commonConfig.cors,
    origin: 'https://app.rindus.de',
  },
});
