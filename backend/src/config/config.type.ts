import { Level } from 'pino';

export type Environment = 'local' | 'development' | 'production' | 'test';

export type LogLevel = Level;

export interface ProcessVariables {
  NODE_ENV: Environment;
  PORT?: string;
  LOG_LEVEL?: LogLevel;
  DB_HOST: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_PORT: string;
  SESSIONS_SECRET: string;
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
  google: Google;
}

export interface Google {
  clientId: string;
}

export interface Cors {
  origin: string;
}
