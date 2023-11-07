import { partnersController } from '@/bootstrap';
import { createRouter } from '@/bootstrap/configure';

const partnersRouter = createRouter();

partnersRouter.get('/partners', (req, res) =>
  partnersController.index(req, res),
);
partnersRouter.get('/partners/:partnerId', (req, res) =>
  partnersController.show(req, res),
);
partnersRouter.get('/partners/:partnerId/members', (req, res) =>
  partnersController.members(req, res),
);

export { partnersRouter };
