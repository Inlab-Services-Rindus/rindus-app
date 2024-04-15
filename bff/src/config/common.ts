import { Config, Environment, ProcessVariables } from '@/config/config.type';

function parseNumber(numberString: string | undefined): number | undefined {
  return numberString ? Number(numberString) : undefined;
}

// TODO: revisit default values
export const getCommonConfig = (
  processVariables: ProcessVariables,
): Config => ({
  environment: (processVariables.BACKEND_NODE_ENV as Environment) || 'development',
  logLevel: processVariables.BACKEND_LOG_LEVEL || 'info',
  database: {
    host: processVariables.BACKEND_DB_HOST || '127.0.0.1',
    name: processVariables.BACKEND_DB_NAME || 'backend',
    port: parseNumber(processVariables.BACKEND_DB_PORT) || 5432,
    user: processVariables.BACKEND_DB_USER || 'api',
    password: processVariables.BACKEND_DB_PASSWORD || 'secret',
  },
  sessions: {
    secret: processVariables.BACKEND_SESSIONS_SECRET || 'mysupersecret',
    maxAge: 86400000,
  },
  app: {
    domain: processVariables.BACKEND_DOMAIN || 'localhost',
    port: parseNumber(processVariables.BACKEND_PORT) || 3000,
    url: processVariables.BACKEND_URL,
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
