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
}

export interface Config {
  environment: Environment;
  logLevel: Level;
  database: Database;
  sessions: Session;
  app: App;
  cors: Cors;
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

export interface Cors {
  origin: string | string[] | RegExp;
}
