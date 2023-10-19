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

  const isLiveEnv = isLiveEnvironment(config);
  app.use(
    session({
      secret: config.sessions.secret,
      cookie: {
        httpOnly: isLiveEnv,
        maxAge: config.sessions.maxAge,
        secure: isLiveEnv,
        sameSite: 'none',
        domain: '.rindus.de',
      },
      proxy: isLiveEnv,
      store,
      resave: false,
      saveUninitialized: true,
    }),
  );

  return app;
};
