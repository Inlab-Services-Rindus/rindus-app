"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.usersController = exports.sessionController = void 0;
const express_1 = __importDefault(require("express"));
const database_1 = require("../bootstrap/database");
const configure_1 = require("../bootstrap/configure");
const user_1 = require("../repository/knex/user");
const google_1 = require("../services/jwt-validator/google");
const session_1 = require("../programs/session");
const user_2 = require("../programs/user");
const session_controller_1 = require("../controllers/session.controller");
const users_controller_1 = require("../controllers/users.controller");
const store = (0, database_1.connectDatabase)();
const expressApp = (0, express_1.default)();
// Repositories
const userRepository = new user_1.KnexUserRepository(store);
// Services
const jwtValidator = new google_1.GoogleJwtValidator();
// Programs
const sessionPrograms = new session_1.SessionPrograms(jwtValidator, userRepository);
const userPrograms = new user_2.UserPrograms(userRepository);
// Controllers
exports.sessionController = new session_controller_1.SessionController(sessionPrograms);
exports.usersController = new users_controller_1.UsersController(userPrograms);
exports.app = (0, configure_1.configure)(expressApp, store);
