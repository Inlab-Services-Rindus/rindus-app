import { Level } from 'pino';

export type Environment = 'local' | 'staging' | 'production' | 'test';

export type LogLevel = Level;

export interface ProcessVariables {
  BFF_NODE_ENV: Environment;
  BFF_PORT?: string;
  BFF_LOG_LEVEL?: LogLevel;
  BFF_DOMAIN?: string;
  BFF_APP_URL?: string;
  BFF_DB_HOST: string;
  BFF_DB_USER: string;
  BFF_DB_PASSWORD: string;
  BFF_DB_NAME: string;
  BFF_DB_PORT: string;
  BFF_SESSIONS_SECRET: string;
  BFF_CORS_ORIGIN: string;
  BFF_GOOGLE_AUTH_CREDENTIALS: string;
  BFF_PERSONIO_PASSWORD: string;
  BFF_SLACK_API_TOKEN: string;
  BFF_API_URL: string;
  BFF_ADMIN_USER: string;
  BFF_ADMIN_PASS: string;
  BFF_OAUTH_CLIENT_ID: string;
  BFF_OAUTH_CLIENT_SECRET: string;
}

export interface Config {
  environment: Environment;
  logLevel: Level;
  database: Database;
  sessions: Session;
  app: App;
  cors: Cors;
  googleAuthCredentials: string;
  personio: Personio;
  slack: Slack;
  api: Api;
  admin: AdminAccount;
}

export interface Database {
  host: string;
  name: string;
  port: number;
  user: string;
  password: string;
}

export interface Session {
  secret: string;
  maxAge: number;
}

export interface App {
  port: number;
  url?: string;
  google: Google;
}

export interface Google {
  clientId: string;
}

interface Personio {
  password: string;
}

interface Slack {
  apiToken: string;
}

interface Api {
  url: string;
  auth: Auth;
}

interface Auth {
  clientId: string;
  clienSecret: string;
}

interface AdminAccount {
  user: string;
  password: string;
}

export interface Cors {
  origin: string | string[] | RegExp;
}
