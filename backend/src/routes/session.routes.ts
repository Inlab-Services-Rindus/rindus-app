import express from 'express';
import { sessionController } from '@/bootstrap';
import { createRouter } from '@/bootstrap/configure';

const sessionRouter = createRouter();

sessionRouter.use('/login', express.json());

sessionRouter.post('/login', (req, res) => sessionController.login(req, res));
sessionRouter.post('/logout', (req, res) => sessionController.logout(req, res));

export { sessionRouter };
