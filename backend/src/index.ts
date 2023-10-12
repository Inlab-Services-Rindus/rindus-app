import { config } from '@/config';

import { app } from '@/bootstrap';
import { unprotectedRouter, protectedRouter } from '@/routes';

import { logger } from '@/bootstrap/logger';

app.use('/', unprotectedRouter);
app.use('/', protectedRouter);

const port = config.app.port;
// Listen http
app.listen(port, () =>
  logger.info(`[server]: Server is running at http://localhost:${port}`),
);

export default app;
