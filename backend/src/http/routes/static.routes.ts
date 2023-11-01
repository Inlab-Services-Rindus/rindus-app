import express from 'express';

import { createRouter } from '@/bootstrap/configure';

const staticRouter = createRouter();

staticRouter.use(express.static('public'));

export { staticRouter };
