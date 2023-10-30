import { searchController } from '@/bootstrap';
import { createRouter } from '@/bootstrap/configure';

const searchRouter = createRouter();

searchRouter.get('/suggestions', (req, res) =>
  searchController.suggestions(req, res),
);
searchRouter.get('/search', (req, res) => searchController.search(req, res));

export { searchRouter };
