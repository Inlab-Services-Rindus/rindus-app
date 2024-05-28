import { adminController } from '@/bootstrap';
import { createRouter } from '@/bootstrap/configure';

const adminRouter = createRouter();

adminRouter.get('/search/index', (req, res) => adminController.index(req, res));
adminRouter.get('/cronjob/personio', (req, res) =>
  adminController.personioJob(req, res),
);
adminRouter.get('/cache/clear', (req, res) =>
  adminController.flushCache(req, res),
);

export { adminRouter };
