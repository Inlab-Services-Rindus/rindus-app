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
exports.SearchPrograms = void 0;
class SearchPrograms {
    constructor(searchService) {
        this.searchService = searchService;
    }
    suggestions(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const [languages, positions, users] = yield Promise.all([
                this.searchService.suggestLanguages(query),
                this.searchService.suggestPositions(query),
                this.searchService.searchUsers(query),
            ]);
            return [...languages, ...positions, { users: users.slice(0, 5) }];
        });
    }
    search(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.searchService.searchUsers(query);
        });
    }
}
exports.SearchPrograms = SearchPrograms;
