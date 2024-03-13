import proxy from 'express-http-proxy';

import { createRouter } from '@/bootstrap/configure';

const avatarsRouter = createRouter();

avatarsRouter.use(
  '/avatars',
  proxy('https://rindus.personio.de/', {
    proxyReqOptDecorator: function (proxyReqOpts) {
      if (proxyReqOpts.headers) {
        proxyReqOpts.headers['Referer'] = 'https://rindus.personio.de/';
      }
      return proxyReqOpts;
    },
    userResHeaderDecorator(headers) {
      // recieves an Object of headers, returns an Object of headers.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { pragma, ...filteredHeaders } = headers;
      return {
        ...filteredHeaders,
        ['cache-control']: 'public, max-age=86400',
      };
    },
  }),
);

export { avatarsRouter };
