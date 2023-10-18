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
    let envConfig;
    switch (environment) {
        case 'development':
            envConfig = development_1.developmentConfig;
            break;
        case 'production':
            envConfig = production_1.productionConfig;
            break;
        default:
            envConfig = local_1.localConfig;
    }
    return Object.assign(Object.assign({}, (0, common_1.getCommonConfig)(process.env)), envConfig);
}
function isLiveEnvironment(config) {
    return (config.environment === 'development' || config.environment === 'production');
}
exports.isLiveEnvironment = isLiveEnvironment;
exports.config = getConfig();
