import knexSessionStore from 'connect-session-knex';
import session from 'express-session';

import { Express } from 'express';
import { Knex } from 'knex';

import { config, isLiveEnvironment } from '@/config';

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

export const httpSessions = (app: Express, knex: Knex): Express => {
  const store = new (knexSessionStore(session))({
    knex,
  });

  app.use(
    session({
      secret: config.sessions.secret,
      cookie: {
        maxAge: config.sessions.maxAge,
        secure: isLiveEnvironment(config),
        sameSite: 'none',
      },
      store,
      resave: false,
      saveUninitialized: true,
    }),
  );

  return app;
};
