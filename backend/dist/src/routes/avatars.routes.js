"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.avatarsRouter = void 0;
const express_http_proxy_1 = __importDefault(require("express-http-proxy"));
const configure_1 = require("../bootstrap/configure");
const avatarsRouter = (0, configure_1.createRouter)();
exports.avatarsRouter = avatarsRouter;
avatarsRouter.use('/', (0, express_http_proxy_1.default)('https://images.personio.de/', {
    proxyReqOptDecorator: function (proxyReqOpts) {
        if (proxyReqOpts.headers) {
            proxyReqOpts.headers['Referer'] = 'https://rindus.personio.de/';
        }
        return proxyReqOpts;
    },
}));
