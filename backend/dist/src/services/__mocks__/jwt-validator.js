"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockJwtValidator = exports.mockValidateToken = void 0;
exports.mockValidateToken = jest.fn().mockResolvedValue('email');
class MockJwtValidator {
    constructor() {
        this.validateToken = exports.mockValidateToken;
    }
}
exports.MockJwtValidator = MockJwtValidator;
