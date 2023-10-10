import { Level } from 'pino';

export type Environment = 'development' | 'production' | 'test';

export type LogLevel = Level;

export interface ProcessVariables {
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
  port: number;
  database: Database;
  sessions: Session;
  app: App;
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
  google: Google;
}

export interface Google {
  clientId: string;
}
