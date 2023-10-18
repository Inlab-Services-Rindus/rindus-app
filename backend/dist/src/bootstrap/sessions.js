"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpSessions = void 0;
const connect_session_knex_1 = __importDefault(require("connect-session-knex"));
const express_session_1 = __importDefault(require("express-session"));
const config_1 = require("../config");
const httpSessions = (app, knex) => {
    const store = new ((0, connect_session_knex_1.default)(express_session_1.default))({
        knex,
    });
    const isLiveEnv = (0, config_1.isLiveEnvironment)(config_1.config);
    app.use((0, express_session_1.default)({
        secret: config_1.config.sessions.secret,
        cookie: {
            httpOnly: isLiveEnv,
            maxAge: config_1.config.sessions.maxAge,
            secure: isLiveEnv,
            sameSite: 'lax',
        },
        proxy: isLiveEnv,
        store,
        resave: false,
        saveUninitialized: true,
    }));
    return app;
};
exports.httpSessions = httpSessions;
