import { usersController } from '@/bootstrap';
import { createRouter } from '@/bootstrap/configure';

const usersRouter = createRouter();

usersRouter.get('/', (req, res) => usersController.index(req, res));
usersRouter.get('/:userId', (req, res) => usersController.show(req, res));

export { usersRouter };
