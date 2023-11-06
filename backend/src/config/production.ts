import { Config } from '@/config/config.type';

export const getProductionConfig = (
  _commonConfig: Config,
): Partial<Config> => ({
  logLevel: 'info',
});
