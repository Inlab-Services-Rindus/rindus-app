"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.staticRouter = void 0;
const express_1 = __importDefault(require("express"));
const configure_1 = require("../../bootstrap/configure");
const staticRouter = (0, configure_1.createRouter)();
exports.staticRouter = staticRouter;
staticRouter.use(express_1.default.static('public'));
