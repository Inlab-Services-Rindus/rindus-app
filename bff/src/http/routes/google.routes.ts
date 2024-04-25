import { googleController } from '@/bootstrap';
import { createRouter } from '@/bootstrap/configure';

const googleRouter = createRouter();

googleRouter.get('/events', (req, res) => googleController.events(req, res));
googleRouter.get('/events/:eventId', (req, res) =>
  googleController.event(req, res),
);

export { googleRouter };
