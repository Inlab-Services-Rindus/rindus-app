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
    userResHeaderDecorator(headers) {
      // recieves an Object of headers, returns an Object of headers.
      return {
        ...headers,
        ['cache-control']: 'public, max-age=0',
      };
    },
  }),
);

export { avatarsRouter };
