"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedRouter = exports.unprotectedRouter = void 0;
const configure_1 = require("../../bootstrap/configure");
const authenticated_1 = require("../../http/middleware/authenticated");
const users_routes_1 = require("../../http/routes/users.routes");
const session_routes_1 = require("../../http/routes/session.routes");
const avatars_routes_1 = require("../../http/routes/avatars.routes");
const partners_routes_1 = require("../../http/routes/partners.routes");
const search_routes_1 = require("../../http/routes/search.routes");
const static_routes_1 = require("../../http/routes/static.routes");
const unprotectedRouter = (0, configure_1.createRouter)();
exports.unprotectedRouter = unprotectedRouter;
const protectedRouter = (0, configure_1.createRouter)();
exports.protectedRouter = protectedRouter;
unprotectedRouter
    .get('/', (_req, res) => res.send('Hello World!'))
    .use(session_routes_1.sessionRouter);
protectedRouter
    .use(authenticated_1.authenticated)
    .use(users_routes_1.usersRouter)
    .use(partners_routes_1.partnersRouter)
    .use(search_routes_1.searchRouter)
    .use(avatars_routes_1.avatarsRouter)
    .use(static_routes_1.staticRouter);
