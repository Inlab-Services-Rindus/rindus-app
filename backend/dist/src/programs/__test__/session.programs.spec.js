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
const User_1 = require("../../model/__mocks__/business/User");
const session_programs_1 = require("../../programs/session.programs");
const user_1 = require("../../repository/__mocks__/user");
const jwt_validator_1 = require("../../services/__mocks__/jwt-validator");
describe('SessionPrograms', () => {
    let sessionProgram;
    beforeAll(() => {
        const mockJwtValidator = new jwt_validator_1.MockJwtValidator();
        const mockUserRepository = new user_1.MockUserRepository();
        sessionProgram = new session_programs_1.SessionPrograms(mockJwtValidator, mockUserRepository);
    });
    describe('login', () => {
        const token = 'foo';
        it('should return user ID based on email', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield sessionProgram.login(token);
            expect(jwt_validator_1.mockValidateToken).toHaveBeenCalledTimes(1);
            expect(user_1.mockFindUser).toHaveBeenCalledTimes(1);
            expect(user).toEqual(User_1.mockUser);
        }));
        it('should not fetch user if no email', () => __awaiter(void 0, void 0, void 0, function* () {
            jwt_validator_1.mockValidateToken.mockResolvedValueOnce(undefined);
            const user = yield sessionProgram.login(token);
            expect(jwt_validator_1.mockValidateToken).toHaveBeenCalledTimes(1);
            expect(user_1.mockFindUser).not.toHaveBeenCalled();
            expect(user).toEqual(undefined);
        }));
        it('should return undefined if no user', () => __awaiter(void 0, void 0, void 0, function* () {
            user_1.mockFindUser.mockResolvedValueOnce(undefined);
            const user = yield sessionProgram.login(token);
            expect(jwt_validator_1.mockValidateToken).toHaveBeenCalledTimes(1);
            expect(user_1.mockFindUser).toHaveBeenCalledTimes(1);
            expect(user).toEqual(undefined);
        }));
    });
});
