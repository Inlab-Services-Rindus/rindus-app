import { Config } from '@/config/config.type';

export const developmentConfig: Partial<Config> = {
  cors: {
    origin: 'https://app.rindus.de',
  },
};
