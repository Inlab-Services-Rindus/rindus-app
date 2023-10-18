"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLoggerMiddleware = exports.logger = void 0;
const pino_1 = __importDefault(require("pino"));
const pino_http_1 = require("pino-http");
const config_1 = require("../config");
const logLevel = config_1.config.environment === 'test' ? 'silent' : config_1.config.logLevel;
exports.logger = (0, pino_1.default)({ level: logLevel });
const httpLoggerMiddleware = (app, logger) => {
    app.use((0, pino_http_1.pinoHttp)({ logger, useLevel: 'trace' }));
    return app;
};
exports.httpLoggerMiddleware = httpLoggerMiddleware;
