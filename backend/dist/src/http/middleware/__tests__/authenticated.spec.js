"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authenticated_1 = require("../../../http/middleware/authenticated");
describe('authenticated', () => {
    it('should forward request if session contains userId', () => {
        const authenticatedRequest = {
            session: {
                userId: 'foo',
            },
        };
        const response = {};
        const nextSpy = jest.fn();
        (0, authenticated_1.authenticated)(authenticatedRequest, response, nextSpy);
        expect(nextSpy).toBeCalled();
    });
    it('should not forward request if session does not contain userId and return 401', () => {
        const request = {
            session: {
                userId: undefined,
            },
        };
        const nextSpy = jest.fn();
        const sendStatusSpy = jest.fn();
        const response = { sendStatus: sendStatusSpy };
        (0, authenticated_1.authenticated)(request, response, nextSpy);
        expect(nextSpy).not.toBeCalled();
        expect(sendStatusSpy).toHaveBeenCalledWith(401);
    });
});
