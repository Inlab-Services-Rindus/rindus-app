import { Config, Environment, ProcessVariables } from '@/config/config.type';

function parseNumber(numberString: string | undefined): number | undefined {
  return numberString ? Number(numberString) : undefined;
}

// TODO: revisit default values
export const getCommonConfig = (
  processVariables: ProcessVariables,
): Config => ({
  environment: (processVariables.BFF_NODE_ENV as Environment) || 'development',
  logLevel: processVariables.BFF_LOG_LEVEL || 'info',
  database: {
    host: processVariables.BFF_DB_HOST || '127.0.0.1',
    name: processVariables.BFF_DB_NAME || 'backend',
    port: parseNumber(processVariables.BFF_DB_PORT) || 5432,
    user: processVariables.BFF_DB_USER || 'api',
    password: processVariables.BFF_DB_PASSWORD || 'secret',
  },
  sessions: {
    secret: processVariables.BFF_SESSIONS_SECRET || 'mysupersecret',
    maxAge: 86400000,
  },
  app: {
    port: parseNumber(processVariables.BFF_PORT) || 3000,
    url: processVariables.BFF_APP_URL,
    google: {
      clientId:
        '107296892437-s1m61pk81b6qqj9g9u60ocml7m8vmnq2.apps.googleusercontent.com',
    },
  },
  cors: {
    // Frontend app | swagger-editor | swagger-ui
    origin:
      processVariables.BFF_CORS_ORIGIN || /http:\/\/localhost:(5173|8888|3080)/,
  },
  // Google API credentials are in base64 format and should be decoded before using
  googleAuthCredentials: Buffer.from(
    process.env.BFF_GOOGLE_AUTH_CREDENTIALS ?? '',
    'base64',
  ).toString('utf-8'),
  personio: {
    password: process.env.BFF_PERSONIO_PASSWORD ?? '',
  },
  slack: {
    apiToken: process.env.BFF_SLACK_API_TOKEN ?? '',
  },
  api: {
    url: process.env.BFF_API_URL ?? 'http://localhost:8080',
  },
});
