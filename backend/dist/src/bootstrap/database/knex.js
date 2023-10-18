"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testKnexConfig = exports.TestDatabaseFileName = exports.knexConfig = void 0;
const config_1 = require("../../config");
exports.knexConfig = {
    client: 'pg',
    connection: {
        host: config_1.config.database.host,
        database: config_1.config.database.name,
        port: config_1.config.database.port,
        user: config_1.config.database.user,
        password: config_1.config.database.password,
        ssl: (0, config_1.isLiveEnvironment)(config_1.config),
    },
    pool: {
        min: 2,
        max: 10,
    },
};
// TODO: Avoid relative path
exports.TestDatabaseFileName = './integration-db.sqlite';
exports.testKnexConfig = {
    client: 'sqlite3',
    useNullAsDefault: true,
    // Uncomment to debug Knex queries
    // debug: true,
    connection: {
        filename: exports.TestDatabaseFileName,
    },
};
