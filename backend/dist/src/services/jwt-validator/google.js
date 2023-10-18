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
exports.GoogleJwtValidator = void 0;
const logger_1 = require("../../bootstrap/logger");
const google_auth_library_1 = require("google-auth-library");
const config_1 = require("../../config");
class GoogleJwtValidator {
    constructor() {
        this.client = new google_auth_library_1.OAuth2Client();
    }
    validateToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            let payload = undefined;
            try {
                const ticket = yield this.client.verifyIdToken({
                    idToken: token,
                    audience: config_1.config.app.google.clientId,
                });
                payload = ticket.getPayload();
            }
            catch (error) {
                logger_1.logger.error(error);
                return undefined;
            }
            logger_1.logger.debug(`Received token id: ${payload === null || payload === void 0 ? void 0 : payload.sub} email: ${payload === null || payload === void 0 ? void 0 : payload.email} issuer: ${payload === null || payload === void 0 ? void 0 : payload.hd}`);
            if (!payload) {
                logger_1.logger.warn('Unusable token, payload was empty');
                return undefined;
            }
            const { email, hd: issuer } = payload;
            if (issuer !== 'rindus.de') {
                logger_1.logger.warn('Issuer was not authorized');
                return undefined;
            }
            if (!email) {
                logger_1.logger.warn('Email was not included');
                return undefined;
            }
            return email;
        });
    }
}
exports.GoogleJwtValidator = GoogleJwtValidator;
