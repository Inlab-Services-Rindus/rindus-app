import { createRouter } from '@/bootstrap/configure';

const helloWorldRouter = createRouter();

helloWorldRouter.get('/', (_req, res) => res.send('Hello World!'));

export { helloWorldRouter };
