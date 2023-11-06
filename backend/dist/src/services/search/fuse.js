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
exports.FuseSearchService = void 0;
class FuseSearchService {
    constructor(usersByName, usersByPosition, languages) {
        this.usersByName = usersByName;
        this.usersByPosition = usersByPosition;
        this.languages = languages;
    }
    suggestPositions(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const positions = (yield this.usersByPosition)
                .search(query, this.suggestionOptions())
                .reduce((acc, result) => result.item.position ? acc.concat(result.item.position) : acc, []);
            return this.toKeywordSuggestion(positions);
        });
    }
    suggestLanguages(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const languages = (yield this.languages)
                .search(query, this.suggestionOptions())
                .map((result) => result.item);
            return this.toKeywordSuggestion(languages);
        });
    }
    toKeywordSuggestion(suggestions) {
        return suggestions.map((suggestion) => ({ keyword: suggestion }));
    }
    suggestionOptions() {
        return { limit: FuseSearchService.KEYWORD_SUGGESTION_LIMIT };
    }
    searchUsers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.usersByName).search(query).map((result) => result.item);
        });
    }
}
exports.FuseSearchService = FuseSearchService;
FuseSearchService.KEYWORD_SUGGESTION_LIMIT = 2;
