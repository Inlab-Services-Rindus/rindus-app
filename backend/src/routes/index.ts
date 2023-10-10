import { createRouter } from '@/bootstrap/configure';
import { helloWorldRouter } from '@/routes/hello-world.routes';
import { usersRouter } from '@/routes/users.routes';
import { sessionRouter } from '@/routes/session.routes';
import { authenticated } from '@/middleware/authenticated';

const unprotectedRouter = createRouter();
const protectedRouter = createRouter();

unprotectedRouter.use(helloWorldRouter);
unprotectedRouter.use(sessionRouter);
protectedRouter.use(authenticated);
protectedRouter.use('/users', usersRouter);

export { unprotectedRouter, protectedRouter };
