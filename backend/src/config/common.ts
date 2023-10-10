import { Config, Environment, ProcessVariables } from '@/config/config.type';

// TODO: revisit default values
export const getCommonConfig = (
  processVariables: ProcessVariables,
): Config => ({
  environment: (process.env.NODE_ENV as Environment) || 'development',
  port: Number(processVariables.PORT) || 3000,
  logLevel: processVariables.LOG_LEVEL || 'info',
  database: {
    host: processVariables.DB_HOST || '127.0.0.1',
    name: processVariables.DB_NAME || 'backend',
    port: Number(processVariables.DB_PORT) || 5432,
    user: processVariables.DB_USER || 'api',
    password: processVariables.DB_PASSWORD || 'secret',
  },
  sessions: {
    secret: processVariables.SESSIONS_SECRET || 'mysupersecret',
    maxAge: 86400,
  },
  app: {
    google: {
      clientId:
        '794492959607-21m9v38tca8f0i957p9bk67li2g7nt9b.apps.googleusercontent.com',
    },
  },
});
