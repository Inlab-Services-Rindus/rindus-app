"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const bootstrap_1 = require("../bootstrap");
const configure_1 = require("../bootstrap/configure");
const usersRouter = (0, configure_1.createRouter)();
exports.usersRouter = usersRouter;
usersRouter.get('/', (req, res) => bootstrap_1.usersController.index(req, res));