"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockUserRepository = exports.mockAll = exports.mockFindUserId = void 0;
exports.mockFindUserId = jest.fn().mockReturnValue('userId');
exports.mockAll = jest.fn().mockReturnValue([]);
class MockUserRepository {
    constructor() {
        this.findUserId = exports.mockFindUserId;
        this.all = exports.mockAll;
    }
}
exports.MockUserRepository = MockUserRepository;
