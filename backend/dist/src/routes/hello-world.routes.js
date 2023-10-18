"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helloWorldRouter = void 0;
const configure_1 = require("../bootstrap/configure");
const helloWorldRouter = (0, configure_1.createRouter)();
exports.helloWorldRouter = helloWorldRouter;
helloWorldRouter.get('/', (_req, res) => res.send('Hello World!'));
