"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRouter = exports.configure = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const logger_1 = require("../bootstrap/logger");
const sessions_1 = require("../bootstrap/sessions");
const config_1 = require("../config");
const configure = (app, knex) => {
    app.disable('x-powered-by');
    app.use((0, cors_1.default)({
        origin: config_1.config.cors.origin,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    }));
    (0, logger_1.httpLoggerMiddleware)(app, logger_1.logger);
    (0, sessions_1.httpSessions)(app, knex);
    return app;
};
exports.configure = configure;
const createRouter = () => express_1.default.Router();
exports.createRouter = createRouter;
