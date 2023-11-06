"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.searchController = exports.partnersController = exports.usersController = exports.sessionController = void 0;
const express_1 = __importDefault(require("express"));
const database_1 = require("../bootstrap/database");
const configure_1 = require("../bootstrap/configure");
const search_1 = require("../bootstrap/search");
const user_repository_1 = require("../repository/knex/user.repository");
const partner_repository_1 = require("../repository/knex/partner.repository");
const language_repository_1 = require("../repository/knex/language.repository");
const google_1 = require("../services/jwt-validator/google");
const fuse_1 = require("../services/search/fuse");
const session_programs_1 = require("../programs/session.programs");
const user_programs_1 = require("../programs/user.programs");
const search_programs_1 = require("../programs/search.programs");
const session_controller_1 = require("../http/controllers/session.controller");
const users_controller_1 = require("../http/controllers/users.controller");
const partners_controller_1 = require("../http/controllers/partners.controller");
const search_controller_1 = require("../http/controllers/search.controller");
const store = (0, database_1.connectDatabase)();
const expressApp = (0, express_1.default)();
// Repositories
const userRepository = new user_repository_1.KnexUserRepository(store);
const partnerRepository = new partner_repository_1.KnexPartnerRepository(store);
const languageRepository = new language_repository_1.KnexLanguageRepository(store);
const usersByName = (0, search_1.initUsersFuseByName)(userRepository);
const usersByPosition = (0, search_1.initUsersFuseByPosition)(userRepository);
const languages = (0, search_1.initLanguagesFuse)(languageRepository);
// Services
const jwtValidator = new google_1.GoogleJwtValidator();
const userSearchService = new fuse_1.FuseSearchService(usersByName, usersByPosition, languages);
// Programs
const sessionPrograms = new session_programs_1.SessionPrograms(jwtValidator, userRepository);
const userPrograms = new user_programs_1.UserPrograms(userRepository);
const searchPrograms = new search_programs_1.SearchPrograms(userSearchService);
// Controllers
exports.sessionController = new session_controller_1.SessionController(sessionPrograms, userRepository);
exports.usersController = new users_controller_1.UsersController(userPrograms);
exports.partnersController = new partners_controller_1.PartnersController(partnerRepository);
exports.searchController = new search_controller_1.SearchController(searchPrograms);
exports.app = (0, configure_1.configure)(expressApp, store);
