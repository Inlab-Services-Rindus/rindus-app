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
const user_programs_1 = require("../../programs/user.programs");
const user_1 = require("../../repository/__mocks__/user");
describe('UserPrograms', () => {
    let userPrograms;
    beforeAll(() => {
        const userRepository = new user_1.MockUserRepository();
        userPrograms = new user_programs_1.UserPrograms(userRepository);
    });
    describe('index', () => {
        it('should call UserRepository', () => __awaiter(void 0, void 0, void 0, function* () {
            yield userPrograms.index();
            expect(user_1.mockAll).toBeCalledTimes(1);
        }));
    });
});
