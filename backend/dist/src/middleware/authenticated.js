"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticated = void 0;
function authenticated(request, response, next) {
    if (request.session.userId) {
        next();
    }
    else {
        response.sendStatus(401);
    }
}
exports.authenticated = authenticated;
