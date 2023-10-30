import { Config } from '@/config/config.type';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const productionConfig = (_commonConfig: Config): Partial<Config> => ({
  logLevel: 'info',
});
