"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partnersRouter = void 0;
const bootstrap_1 = require("../../bootstrap");
const configure_1 = require("../../bootstrap/configure");
const partnersRouter = (0, configure_1.createRouter)();
exports.partnersRouter = partnersRouter;
partnersRouter.get('/partners', (req, res) => bootstrap_1.partnersController.index(req, res));
