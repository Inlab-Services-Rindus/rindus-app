import knexSessionStore from 'connect-session-knex';
import session from 'express-session';
import cookieParser from 'cookie-parser';

import { Express } from 'express';
import { Knex } from 'knex';

import { config, isLiveEnvironment } from '@/config';

declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

export const cookieConfig = (isLiveEnv: boolean): session.CookieOptions => ({
  httpOnly: isLiveEnv,
  maxAge: config.sessions.maxAge,
  secure: isLiveEnv,
  sameSite: isLiveEnv ? 'none' : 'lax',
});

export const SESSION_COOKIE_NAME = 'sid';

export const httpSessions = (app: Express, knex: Knex): Express => {
  app.use(cookieParser());
  const store = new (knexSessionStore(session))({
    knex,
  });

  const isLiveEnv = isLiveEnvironment(config);
  app.use(
    session({
      secret: config.sessions.secret,
      name: SESSION_COOKIE_NAME,
      proxy: isLiveEnv,
      cookie: cookieConfig(isLiveEnv),
      store,
      resave: false,
      saveUninitialized: false,
    }),
  );

  return app;
};
