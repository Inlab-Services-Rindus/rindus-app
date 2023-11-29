import express from 'express';

import { createRouter } from '@/bootstrap/configure';
import { config } from '@/config';

const staticRouter = createRouter();

staticRouter.use(
  express.static('public', {
    maxAge: config.sessions.maxAge,
  }),
);

export { staticRouter };
