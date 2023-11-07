import { Converter } from '@/converters/Converter';
import { UserConverter } from '@/converters/api/User.converter';
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
  private readonly userConverter: UserConverter;

  constructor() {
    this.userConverter = new UserConverter();
  }

  convert(source: User): SuggestionUser {
    return {
      ...this.userConverter.convert(source),
      position: source.position,
    };
  }
}
