"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionRouter = void 0;
const express_1 = __importDefault(require("express"));
const bootstrap_1 = require("../../bootstrap");
const configure_1 = require("../../bootstrap/configure");
const sessionRouter = (0, configure_1.createRouter)();
exports.sessionRouter = sessionRouter;
sessionRouter.use('/login', express_1.default.json());
sessionRouter.post('/login', (req, res) => bootstrap_1.sessionController.login(req, res));
sessionRouter.get('/soft-login', (req, res) => bootstrap_1.sessionController.softLogin(req, res));
sessionRouter.post('/logout', (req, res) => bootstrap_1.sessionController.logout(req, res));
