"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initLanguagesFuse = exports.initUsersFuseByPosition = exports.initUsersFuseByName = void 0;
const fuse_js_1 = __importDefault(require("fuse.js"));
function initUsersFuseByName(userRepository) {
    return __awaiter(this, void 0, void 0, function* () {
        return initUsersFuse(userRepository, ['firstName', 'lastName']);
    });
}
exports.initUsersFuseByName = initUsersFuseByName;
function initUsersFuseByPosition(userRepository) {
    return __awaiter(this, void 0, void 0, function* () {
        return initUsersFuse(userRepository, ['position']);
    });
}
exports.initUsersFuseByPosition = initUsersFuseByPosition;
function initLanguagesFuse(languageRepository) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            isCaseSensitive: false,
            keys: ['name'],
            minMatchCharLength: 3,
        };
        const languages = yield languageRepository.all();
        return new fuse_js_1.default(languages, options);
    });
}
exports.initLanguagesFuse = initLanguagesFuse;
function initUsersFuse(userRepository, keys) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            isCaseSensitive: false,
            minMatchCharLength: 3,
            keys,
        };
        const users = yield userRepository.all();
        return new fuse_js_1.default(users, options);
    });
}
