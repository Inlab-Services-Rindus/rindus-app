import { config } from '@/config';

import { app } from '@/bootstrap';
import {
  unprotectedRouter,
  protectedRouter,
  httpBasicProtectedRouter,
} from '@/http/routes';

import { logger } from '@/bootstrap/logger';

app.use('/', unprotectedRouter);
app.use('/', protectedRouter);
app.use('/admin/', httpBasicProtectedRouter);

const port = config.app.port;
const url = config.app.url;
app.listen(port, () => logger.info(`[server]: Server is running at ${url}`));

export default app;
