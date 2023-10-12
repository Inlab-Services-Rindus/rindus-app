import https from 'https';

import { config, isLiveEnvironment } from '@/config';

import { app } from '@/bootstrap';
import { unprotectedRouter, protectedRouter } from '@/routes';

import { logger } from '@/bootstrap/logger';

app.use('/', unprotectedRouter);
app.use('/', protectedRouter);

const startupLogger = (port: number, secure: boolean) => () => {
  logger.info(
    `[server]: Server is running at http${
      secure ? 's' : ''
    }://localhost:${port}`,
  );
};

const privateKey = Buffer.from(
  process.env.SSL_PRIVATE_KEY || '',
  'base64',
).toString('ascii');
const cert = Buffer.from(process.env.SSL_CERT || '', 'base64').toString(
  'ascii',
);

if (isLiveEnvironment(config)) {
  const httpsPort = config.app.port.https;
  // Create certs on the fly + listen https
  https
    .createServer({ key: privateKey, cert }, app)
    .listen(httpsPort, startupLogger(httpsPort, true));
} else {
  const httpPort = config.app.port.http;
  // Listen http
  app.listen(httpPort, startupLogger(httpPort, false));
}

export default app;
