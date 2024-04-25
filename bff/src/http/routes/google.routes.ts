import { googleController } from '@/bootstrap';
import { createRouter } from '@/bootstrap/configure';

const googleRouter = createRouter();

googleRouter.get('/events', (req, res) => googleController.events(req, res));

export { googleRouter };
