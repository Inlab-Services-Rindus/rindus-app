"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuggestionsConverter = void 0;
class SuggestionsConverter {
    constructor() {
        this.suggestionUserConverter = new SuggestionUserConverter();
    }
    convert(source) {
        return source.map((suggestion) => {
            if ('keyword' in suggestion) {
                return {
                    type: 'keyword',
                    data: suggestion.keyword,
                };
            }
            else {
                return {
                    type: 'freetext',
                    data: suggestion.users.map((user) => this.suggestionUserConverter.convert(user)),
                };
            }
        });
    }
}
exports.SuggestionsConverter = SuggestionsConverter;
class SuggestionUserConverter {
    convert(source) {
        return {
            id: source.id,
            fullName: source.fullName,
            position: source.position,
        };
    }
}
