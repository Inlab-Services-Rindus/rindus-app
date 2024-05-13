import { adminController } from '@/bootstrap';
import { createRouter } from '@/bootstrap/configure';

const searchEngineRouter = createRouter();

searchEngineRouter.get('/search/index', (req, res) =>
  adminController.index(req, res),
);

export { searchEngineRouter };
