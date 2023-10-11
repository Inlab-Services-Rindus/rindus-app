import { Config } from '@/config/config.type';

export const developmentConfig: Partial<Config> = {
  logLevel: 'info',
  cors: {
    origin: 'https://rindus-app-nine.vercel.app',
  },
};
