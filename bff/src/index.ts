import { config } from '@/config';

import { app } from '@/bootstrap';
import {
  unprotectedRouter,
  protectedRouter,
  googleProtectedRouter,
} from '@/http/routes';

import { logger } from '@/bootstrap/logger';

//Before to / because if not, it will be catched by the / route
app.use('/google/v1', googleProtectedRouter);

app.use('/', unprotectedRouter);
app.use('/', protectedRouter);

const port = config.app.port;
const url = config.app.url;
app.listen(port, () => logger.info(`[server]: Server is running at ${url}`));

export default app;
