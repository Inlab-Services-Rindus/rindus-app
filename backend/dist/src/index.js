"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const bootstrap_1 = require("./bootstrap");
const routes_1 = require("./routes");
const logger_1 = require("./bootstrap/logger");
bootstrap_1.app.use('/', routes_1.unprotectedRouter);
bootstrap_1.app.use('/', routes_1.protectedRouter);
const port = config_1.config.app.port;
// Listen http
bootstrap_1.app.listen(port, () => logger_1.logger.info(`[server]: Server is running at http://localhost:${port}`));
exports.default = bootstrap_1.app;