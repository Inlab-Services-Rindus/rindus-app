import { Level } from 'pino';

export type Environment = 'local' | 'development' | 'production' | 'test';

export type LogLevel = Level;

export interface ProcessVariables {
  BACKEND_NODE_ENV: Environment;
  BACKEND_PORT?: string;
  BACKEND_LOG_LEVEL?: LogLevel;
  BACKEND_DOMAIN?: string;
  BACKEND_URL?: string;
  BACKEND_DB_HOST: string;
  BACKEND_DB_USER: string;
  BACKEND_DB_PASSWORD: string;
  BACKEND_DB_NAME: string;
  BACKEND_DB_PORT: string;
  BACKEND_SESSIONS_SECRET: string;
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
  domain: string;
  url?: string;
  google: Google;
}

export interface Google {
  clientId: string;
}

export interface Cors {
  origin: string | string[] | RegExp;
}
