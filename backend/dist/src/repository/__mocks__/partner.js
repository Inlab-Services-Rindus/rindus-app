"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockPartnerRepository = exports.mockAll = void 0;
exports.mockAll = jest.fn().mockReturnValue([]);
class MockPartnerRepository {
    constructor() {
        this.all = exports.mockAll;
    }
}
exports.MockPartnerRepository = MockPartnerRepository;
