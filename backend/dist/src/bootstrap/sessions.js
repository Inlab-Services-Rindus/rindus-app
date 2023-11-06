"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpSessions = exports.cookieConfig = void 0;
const connect_session_knex_1 = __importDefault(require("connect-session-knex"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = require("../config");
const cookieConfig = (isLiveEnv) => ({
    httpOnly: isLiveEnv,
    maxAge: config_1.config.sessions.maxAge,
    secure: isLiveEnv,
    sameSite: isLiveEnv ? 'none' : 'lax',
});
exports.cookieConfig = cookieConfig;
const httpSessions = (app, knex) => {
    app.use((0, cookie_parser_1.default)());
    const store = new ((0, connect_session_knex_1.default)(express_session_1.default))({
        knex,
    });
    const isLiveEnv = (0, config_1.isLiveEnvironment)(config_1.config);
    app.use((0, express_session_1.default)({
        secret: config_1.config.sessions.secret,
        proxy: isLiveEnv,
        cookie: (0, exports.cookieConfig)(isLiveEnv),
        store,
        resave: false,
        saveUninitialized: false,
    }));
    return app;
};
exports.httpSessions = httpSessions;
