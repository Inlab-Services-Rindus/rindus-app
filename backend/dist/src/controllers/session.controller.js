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
const logger_1 = require("../bootstrap/logger");
class SessionController {
    constructor(sessionPrograms) {
        this.sessionProgram = sessionPrograms;
    }
    login(request, response) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const jwt = (_a = request.body) === null || _a === void 0 ? void 0 : _a.jwt;
            if (!jwt) {
                return response.sendStatus(400);
            }
            const maybeUserId = yield this.sessionProgram.login(jwt);
            if (maybeUserId !== undefined) {
                request.session.userId = maybeUserId;
                return response.sendStatus(200);
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
                return response.sendStatus(200);
            }
            return response.sendStatus(200);
        });
    }
}
exports.SessionController = SessionController;
