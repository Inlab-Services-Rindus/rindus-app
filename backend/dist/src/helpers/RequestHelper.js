"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePageQueryParam = void 0;
function parsePageQueryParam(request) {
    const queryStringPage = request.query.page;
    if (typeof queryStringPage === 'string') {
        return Number(queryStringPage);
    }
    else {
        return 1;
    }
}
exports.parsePageQueryParam = parsePageQueryParam;
