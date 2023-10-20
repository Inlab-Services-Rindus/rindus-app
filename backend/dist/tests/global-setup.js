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
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../src/bootstrap/database");
exports.default = (globalConfig) => __awaiter(void 0, void 0, void 0, function* () {
    if (globalConfig.testPathPattern !== 'repository') {
        // No database needed for unit tests
        return;
    }
    yield (0, database_1.connectTestDatabase)().migrate.latest();
    console.log('Database started and migrated succesfully');
});
