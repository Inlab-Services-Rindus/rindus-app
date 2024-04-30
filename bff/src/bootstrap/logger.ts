import pino, { Logger } from 'pino';

import { Express } from 'express';
import { pinoHttp } from 'pino-http';

import { config } from '@/config';

const logLevel = config.environment === 'test' ? 'silent' : config.logLevel;
export const logger = pino({ level: logLevel });

export const httpLoggerMiddleware = (app: Express, logger: Logger) => {
  app.use(pinoHttp({ logger, useLevel: 'trace' }));

  return app;
};
