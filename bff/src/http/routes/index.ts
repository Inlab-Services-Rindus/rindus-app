import { createRouter } from '@/bootstrap/configure';
import { authenticated } from '@/http/middleware/authenticated';
import { usersRouter } from '@/http/routes/users.routes';
import { sessionRouter } from '@/http/routes/session.routes';
import { avatarsRouter } from '@/http/routes/avatars.routes';
import { partnersRouter } from '@/http/routes/partners.routes';
import { searchRouter } from '@/http/routes/search.routes';
import { staticRouter } from '@/http/routes/static.routes';
import { googleRouter } from '@/http/routes/google.routes';
import { httpBasicAuthenticated } from '@/http/middleware/http-basic-authenticated';
import { searchEngineRouter } from '@/http/routes/search-engine.routes';

const unprotectedRouter = createRouter();
const protectedRouter = createRouter();
const httpBasicProtectedRouter = createRouter();

unprotectedRouter
  .get('/', (_req, res) => res.send('Hello World!'))
  .use(sessionRouter);

protectedRouter
  .use(authenticated)
  .use(usersRouter)
  .use(partnersRouter)
  .use(searchRouter)
  .use(avatarsRouter)
  .use(staticRouter)
  .use('/google/v1', googleRouter);

httpBasicProtectedRouter.use(httpBasicAuthenticated).use(searchEngineRouter);

export { unprotectedRouter, protectedRouter, httpBasicProtectedRouter };
