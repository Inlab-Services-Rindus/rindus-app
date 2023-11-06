"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDevelopmentConfig = void 0;
const getDevelopmentConfig = (commonConfig) => ({
    cors: Object.assign(Object.assign({}, commonConfig.cors), { origin: 'https://app.rindus.de' }),
});
exports.getDevelopmentConfig = getDevelopmentConfig;
