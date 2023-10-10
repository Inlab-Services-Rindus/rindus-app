import cors from 'cors';

import express, { Express } from 'express';
import { Knex } from 'knex';

import { httpLoggerMiddleware, logger } from '@/bootstrap/logger';
import { httpSessions } from '@/bootstrap/sessions';

export const configure = (app: Express, knex: Knex) => {
  app.disable('x-powered-by');
  app.use(cors());
  httpLoggerMiddleware(app, logger);
  httpSessions(app, knex);

  return app;
};

export const createRouter = () => express.Router();
