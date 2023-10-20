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
const google_1 = require("../../services/jwt-validator/google");
const emailMock = 'test@rindus.de';
const payloadMock = { hd: 'rindus.de', email: emailMock };
const mockGetPayload = jest.fn().mockReturnValue(payloadMock);
jest.mock('google-auth-library', () => ({
    OAuth2Client: jest.fn(() => ({
        verifyIdToken: jest.fn(() => Promise.resolve({
            getPayload: mockGetPayload,
        })),
    })),
}));
describe('GoogleJwtValidator', () => {
    let googleJwtValidator;
    beforeAll(() => {
        googleJwtValidator = new google_1.GoogleJwtValidator();
    });
    describe('validateToken', () => {
        const token = 'foo';
        it('should return email when the token is correct', () => __awaiter(void 0, void 0, void 0, function* () {
            const email = yield googleJwtValidator.validateToken(token);
            expect(email).toEqual(emailMock);
        }));
        it('should return undefined if issuer is not valid', () => __awaiter(void 0, void 0, void 0, function* () {
            mockGetPayload.mockReturnValueOnce(Object.assign(Object.assign({}, payloadMock), { hd: 'bad-issuer.com' }));
            const email = yield googleJwtValidator.validateToken(token);
            expect(email).toEqual(undefined);
        }));
        it('should return undefined if email not included', () => __awaiter(void 0, void 0, void 0, function* () {
            mockGetPayload.mockReturnValueOnce(Object.assign(Object.assign({}, payloadMock), { email: undefined }));
            const email = yield googleJwtValidator.validateToken(token);
            expect(email).toEqual(undefined);
        }));
        it('should return undefined if no payload', () => __awaiter(void 0, void 0, void 0, function* () {
            mockGetPayload.mockReturnValueOnce(undefined);
            const email = yield googleJwtValidator.validateToken(token);
            expect(email).toEqual(undefined);
        }));
        it('should return undefined if exception', () => __awaiter(void 0, void 0, void 0, function* () {
            mockGetPayload.mockImplementation(() => {
                throw Error;
            });
            const email = yield googleJwtValidator.validateToken(token);
            expect(email).toEqual(undefined);
        }));
    });
});
