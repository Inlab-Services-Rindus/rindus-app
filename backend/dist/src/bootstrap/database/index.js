"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectTestDatabase = exports.connectDatabase = void 0;
const knex_1 = __importDefault(require("knex"));
const knex_2 = require("../../bootstrap/database/knex");
function connect(config) {
    return (0, knex_1.default)(config);
}
function connectDatabase() {
    return connect(knex_2.knexConfig);
}
exports.connectDatabase = connectDatabase;
function connectTestDatabase() {
    return connect(knex_2.testKnexConfig);
}
exports.connectTestDatabase = connectTestDatabase;
