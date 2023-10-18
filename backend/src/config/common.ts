import { Config, Environment, ProcessVariables } from '@/config/config.type';

function parseNumber(numberString: string | undefined): number | undefined {
  return numberString ? Number(numberString) : undefined;
}

// TODO: revisit default values
export const getCommonConfig = (
  processVariables: ProcessVariables,
): Config => ({
  environment: (process.env.NODE_ENV as Environment) || 'development',
  logLevel: processVariables.LOG_LEVEL || 'info',
  database: {
    host: processVariables.DB_HOST || '127.0.0.1',
    name: processVariables.DB_NAME || 'backend',
    port: parseNumber(processVariables.DB_PORT) || 5432,
    user: processVariables.DB_USER || 'api',
    password: processVariables.DB_PASSWORD || 'secret',
  },
  sessions: {
    secret: processVariables.SESSIONS_SECRET || 'mysupersecret',
    maxAge: 86400000,
  },
  app: {
    port: parseNumber(processVariables.PORT) || 3000,
    google: {
      clientId:
        '794492959607-21m9v38tca8f0i957p9bk67li2g7nt9b.apps.googleusercontent.com',
    },
  },
  cors: {
    origin: 'https://rindus-app-git-poc-pedros-projects-f183f2c0.vercel.app',
  },
});
