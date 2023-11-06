"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchRouter = void 0;
const bootstrap_1 = require("../../bootstrap");
const configure_1 = require("../../bootstrap/configure");
const searchRouter = (0, configure_1.createRouter)();
exports.searchRouter = searchRouter;
searchRouter.get('/suggestions', (req, res) => bootstrap_1.searchController.suggestions(req, res));
searchRouter.get('/search', (req, res) => bootstrap_1.searchController.search(req, res));
