import proxy from 'express-http-proxy';

import { createRouter } from '@/bootstrap/configure';

const avatarsRouter = createRouter();

avatarsRouter.use(
  '/avatars',
  proxy('https://images.personio.de/', {
    proxyReqOptDecorator: function (proxyReqOpts) {
      if (proxyReqOpts.headers) {
        proxyReqOpts.headers['Referer'] = 'https://rindus.personio.de/';
      }
      return proxyReqOpts;
    },
  }),
);

export { avatarsRouter };
