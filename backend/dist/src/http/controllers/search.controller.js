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
exports.SearchController = void 0;
const Search_converter_1 = require("../../converters/api/Search.converter");
const User_converter_1 = require("../../converters/api/User.converter");
class SearchController {
    constructor(searchPrograms) {
        this.searchPrograms = searchPrograms;
        this.userResultConverter = new User_converter_1.UserResultConverter();
        this.suggestionsConverter = new Search_converter_1.SuggestionsConverter();
    }
    suggestions(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const maybeQuery = this.parseQuery(request);
            if (maybeQuery) {
                const results = yield this.searchPrograms.suggestions(maybeQuery);
                const suggestions = this.suggestionsConverter.convert(results);
                return response.send(suggestions);
            }
            return response.send([]);
        });
    }
    search(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const maybeQuery = this.parseQuery(request);
            if (maybeQuery) {
                const users = yield this.searchPrograms.search(maybeQuery);
                const results = users.map((user) => this.userResultConverter.convert(user));
                return response.send(results);
            }
            return response.send([]);
        });
    }
    parseQuery(request) {
        const query = request.query.query;
        if (typeof query !== 'string') {
            return undefined;
        }
        return query;
    }
}
exports.SearchController = SearchController;
