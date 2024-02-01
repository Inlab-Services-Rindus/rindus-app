import { Config } from '@/config/config.type';

export const commonConfigResultMock: Config = {
  environment: 'development',
  logLevel: 'info',
  database: {
    host: '127.0.0.1',
    name: 'backend',
    port: 5432,
    user: 'api',
    password: 'secret',
  },
  sessions: {
    secret: 'mysupersecret',
    maxAge: 86400000,
  },
  app: {
    domain: 'localhost',
    port: 3000,
    url: 'http://localhost:3000',
    google: {
      clientId:
        '794492959607-21m9v38tca8f0i957p9bk67li2g7nt9b.apps.googleusercontent.com',
    },
  },
  cors: {
    origin: '/http:\\/\\/localhost:(5173|8888|3080)/',
  },
};

export const developmentConfigResultMock: Partial<Config> = {
  cors: { origin: 'https://app.rindus.de' },
};
