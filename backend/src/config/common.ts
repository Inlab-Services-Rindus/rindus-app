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
    domain: processVariables.DOMAIN || 'localhost',
    port: parseNumber(processVariables.PORT) || 3000,
    url: processVariables.URL,
    google: {
      clientId:
        '107296892437-s1m61pk81b6qqj9g9u60ocml7m8vmnq2.apps.googleusercontent.com',
    },
  },
  cors: {
    // Frontend app | swagger-editor | swagger-ui
    origin: /http:\/\/localhost:(5173|8888|3080)/,
  },
});
