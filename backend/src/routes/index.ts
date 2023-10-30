import { createRouter } from '@/bootstrap/configure';
import { authenticated } from '@/middleware/authenticated';
import { helloWorldRouter } from '@/routes/hello-world.routes';
import { usersRouter } from '@/routes/users.routes';
import { sessionRouter } from '@/routes/session.routes';
import { avatarsRouter } from '@/routes/avatars.routes';
import { partnersRouter } from '@/routes/partners.routes';
import { searchRouter } from '@/routes/search.routes';
import { staticRouter } from '@/routes/static.routes';

const unprotectedRouter = createRouter();
const protectedRouter = createRouter();

unprotectedRouter.use(helloWorldRouter);
unprotectedRouter.use(sessionRouter);
protectedRouter.use(authenticated);
protectedRouter.use('/users', usersRouter);
protectedRouter.use('/partners', partnersRouter);
protectedRouter.use('/avatars', avatarsRouter);
protectedRouter.use(searchRouter);
protectedRouter.use(staticRouter);

export { unprotectedRouter, protectedRouter };
