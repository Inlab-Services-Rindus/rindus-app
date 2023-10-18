"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedRouter = exports.unprotectedRouter = void 0;
const configure_1 = require("../bootstrap/configure");
const hello_world_routes_1 = require("../routes/hello-world.routes");
const users_routes_1 = require("../routes/users.routes");
const session_routes_1 = require("../routes/session.routes");
const avatars_1 = require("../routes/avatars");
const authenticated_1 = require("../middleware/authenticated");
const unprotectedRouter = (0, configure_1.createRouter)();
exports.unprotectedRouter = unprotectedRouter;
const protectedRouter = (0, configure_1.createRouter)();
exports.protectedRouter = protectedRouter;
unprotectedRouter.use(hello_world_routes_1.helloWorldRouter);
unprotectedRouter.use(session_routes_1.sessionRouter);
protectedRouter.use(authenticated_1.authenticated);
protectedRouter.use('/users', users_routes_1.usersRouter);
protectedRouter.use('/avatars', avatars_1.avatarsRouter);