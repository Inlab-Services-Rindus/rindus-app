import { partnersController } from '@/bootstrap';
import { createRouter } from '@/bootstrap/configure';

const partnersRouter = createRouter();

partnersRouter.get('/partners', (req, res) =>
  partnersController.index(req, res),
);

export { partnersRouter };
