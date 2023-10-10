import { usersController } from '@/bootstrap';
import { createRouter } from '@/bootstrap/configure';

const usersRouter = createRouter();

usersRouter.get('/', (req, res) => usersController.index(req, res));

export { usersRouter };
