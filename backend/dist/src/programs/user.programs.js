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
exports.UserPrograms = void 0;
class UserPrograms {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    index(mockBirthdays, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const usersPage = yield this.userRepository.page(page);
            const { data: users } = usersPage;
            return Object.assign(Object.assign({}, usersPage), { data: page > 1 ? this.mockIsBirthday(users, mockBirthdays) : users });
        });
    }
    mockIsBirthday(users, mockBirthdays) {
        return users.map((user, index) => {
            let mockBirthday = false;
            if (mockBirthdays && index < 3) {
                mockBirthday = true;
            }
            return Object.assign(Object.assign({}, user), { isBirthday: mockBirthday || user.isBirthday });
        });
    }
    show(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.findUserWithInfo(userId);
        });
    }
}
exports.UserPrograms = UserPrograms;
