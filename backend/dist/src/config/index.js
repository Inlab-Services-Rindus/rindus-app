"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.isLiveEnvironment = void 0;
const dotenv_1 = require("dotenv");
const local_1 = require("../config/local");
const development_1 = require("../config/development");
const production_1 = require("../config/production");
const common_1 = require("../config/common");
function getConfig() {
    const environment = process.env.NODE_ENV || 'local';
    (0, dotenv_1.config)();
    const commonConfig = (0, common_1.getCommonConfig)(process.env);
    let envConfig;
    switch (environment) {
        case 'development':
            envConfig = (0, development_1.getDevelopmentConfig)(commonConfig);
            break;
        case 'production':
            envConfig = (0, production_1.getProductionConfig)(commonConfig);
            break;
        default:
            envConfig = (0, local_1.getLocalConfig)(commonConfig);
    }
    return Object.assign(Object.assign({}, commonConfig), envConfig);
}
function isLiveEnvironment(config) {
    return (config.environment === 'development' || config.environment === 'production');
}
exports.isLiveEnvironment = isLiveEnvironment;
exports.config = getConfig();
