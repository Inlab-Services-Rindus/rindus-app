import https from 'https';
import createCert from 'create-cert';

import { config } from '@/config';

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

const httpPort = config.app.port.http;
// Listen http
app.listen(httpPort, startupLogger(httpPort, false));
// const httpsPort = config.app.port.https;
// Create certs on the fly + listen https
// createCert().then((credentials) => {
//   https
//     .createServer(credentials, app)
//     .listen(httpsPort, startupLogger(httpsPort, true));
// });

export default app;
