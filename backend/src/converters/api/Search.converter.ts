import { Converter } from '@/converters/Converter';
import { SuggestionUser, Suggestions } from '@/models/api/search/Suggestion';
import { Suggestion } from '@/models/business/Suggestions';
import { User } from '@/models/business/User';

export class SuggestionsConverter
  implements Converter<Suggestion[], Suggestions>
{
  private readonly suggestionUserConverter: SuggestionUserConverter;

  constructor() {
    this.suggestionUserConverter = new SuggestionUserConverter();
  }

  convert(source: Suggestion[]): Suggestions {
    return source.map((suggestion) => {
      if ('keyword' in suggestion) {
        return {
          type: 'keyword',
          data: suggestion.keyword,
        };
      } else {
        return {
          type: 'freetext',
          data: suggestion.users.map((user) =>
            this.suggestionUserConverter.convert(user),
          ),
        };
      }
    });
  }
}

class SuggestionUserConverter implements Converter<User, SuggestionUser> {
  convert(source: User): SuggestionUser {
    return {
      id: source.id,
      fullName: source.fullName,
      position: source.position,
    };
  }
}
