import { Config } from '@/config/config.type';

export const getLocalConfig = (commonConfig: Config): Partial<Config> => ({
  app: {
    ...commonConfig.app,
    url:
      commonConfig.app.url ||
      `http://${commonConfig.app.domain}:${commonConfig.app.port}`,
  },
});
