"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionController = void 0;
const logger_1 = require("../../bootstrap/logger");
const sessions_1 = require("../../bootstrap/sessions");
const config_1 = require("../../config");
const Session_converter_1 = require("../../converters/api/Session.converter");
class SessionController {
    constructor(sessionPrograms, userRepository) {
        this.sessionProgram = sessionPrograms;
        this.userRepository = userRepository;
        this.loggedInUserConverter = new Session_converter_1.LoggedInUserConverter();
    }
    login(request, response) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const jwt = (_a = request.body) === null || _a === void 0 ? void 0 : _a.jwt;
            if (!jwt) {
                return response.sendStatus(400);
            }
            const maybeUser = yield this.sessionProgram.login(jwt);
            if (maybeUser !== undefined) {
                const apiUserLogin = this.loggedInUserConverter.convert(maybeUser);
                request.session.userId = apiUserLogin.id;
                return response.send(apiUserLogin);
            }
            return response.sendStatus(401);
        });
    }
    softLogin(request, response) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!request.cookies['connect.sid']) {
                return response.sendStatus(204);
            }
            const maybeUserId = (_a = request.session) === null || _a === void 0 ? void 0 : _a.userId;
            if (maybeUserId) {
                const maybeUser = yield this.userRepository.findUserById(maybeUserId);
                if (maybeUser) {
                    return response.send(this.loggedInUserConverter.convert(maybeUser));
                }
                return response.sendStatus(401);
            }
            return response.sendStatus(401);
        });
    }
    logout(request, response) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const userId = (_a = request.session) === null || _a === void 0 ? void 0 : _a.userId;
            if (userId) {
                request.session.destroy(() => logger_1.logger.debug('User session destroyed'));
                const cookieConf = (0, sessions_1.cookieConfig)((0, config_1.isLiveEnvironment)(config_1.config));
                return response
                    .cookie('connect.sid', '', Object.assign(Object.assign({}, cookieConf), { maxAge: 1 }))
                    .sendStatus(200);
            }
            return response.sendStatus(200);
        });
    }
}
exports.SessionController = SessionController;
