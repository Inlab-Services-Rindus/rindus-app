"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePersonioJSONFile = exports.PERSONIO_USERS_FILE_NAME = exports.USERS_FILE_NAME = void 0;
const fs_1 = __importDefault(require("fs"));
const RESOURCES_PATH = './seeds/resources';
exports.USERS_FILE_NAME = `${RESOURCES_PATH}/users.json`;
exports.PERSONIO_USERS_FILE_NAME = `${RESOURCES_PATH}/personio-users.json`;
function parsePersonioJSONFile() {
    if (fs_1.default.existsSync(exports.PERSONIO_USERS_FILE_NAME)) {
        return parseJSON(exports.PERSONIO_USERS_FILE_NAME);
    }
    else {
        return parseJSON(exports.USERS_FILE_NAME);
    }
}
exports.parsePersonioJSONFile = parsePersonioJSONFile;
function parseJSON(fileName) {
    return JSON.parse(fs_1.default.readFileSync(fileName).toString('utf-8'));
}
