"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalConfig = void 0;
const getLocalConfig = (commonConfig) => ({
    app: Object.assign(Object.assign({}, commonConfig.app), { url: commonConfig.app.url ||
            `http://${commonConfig.app.domain}:${commonConfig.app.port}` }),
});
exports.getLocalConfig = getLocalConfig;
