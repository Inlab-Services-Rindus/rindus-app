"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./src/config");
const knex_1 = require("./src/bootstrap/database/knex");
exports.default = knex_1.knexConfig;
