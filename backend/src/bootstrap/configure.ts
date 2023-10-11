import cors from 'cors';

import express, { Express } from 'express';
import { Knex } from 'knex';

import { httpLoggerMiddleware, logger } from '@/bootstrap/logger';
import { httpSessions } from '@/bootstrap/sessions';
import { config } from '@/config';

export const configure = (app: Express, knex: Knex) => {
  app.disable('x-powered-by');
  app.use(
    cors({
      origin: config.cors.origin,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    }),
  );
  httpLoggerMiddleware(app, logger);
  httpSessions(app, knex);

  return app;
};

export const createRouter = () => express.Router();
