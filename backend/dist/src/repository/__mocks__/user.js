"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockUserRepository = exports.mockAll = exports.mockFindUser = void 0;
const User_1 = require("../../model/__mocks__/business/User");
exports.mockFindUser = jest.fn().mockReturnValue(User_1.mockUser);
exports.mockAll = jest.fn().mockReturnValue([]);
class MockUserRepository {
    constructor() {
        this.findUser = exports.mockFindUser;
        this.all = exports.mockAll;
    }
}
exports.MockUserRepository = MockUserRepository;
