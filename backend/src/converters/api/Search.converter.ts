import { Converter } from '@/converters/Converter';
import { UserConverter } from '@/converters/api/User.converter';
import {
  SuggestionUser,
  SuggestionsResult,
} from '@/models/api/search/Suggestion';
import { Suggestions } from '@/models/business/Suggestions';
import { User } from '@/models/business/User';

export class SuggestionsResultConverter
  implements Converter<Suggestions, SuggestionsResult>
{
  private readonly suggestionUserConverter: SuggestionUserConverter;

  constructor() {
    this.suggestionUserConverter = new SuggestionUserConverter();
  }

  convert(source: Suggestions): SuggestionsResult {
    return source.reduce((acc, suggestion) => {
      if (Array.isArray(suggestion)) {
        return acc.concat(
          suggestion.map((user) => this.suggestionUserConverter.convert(user)),
        );
      } else if (typeof suggestion === 'string') {
        return acc.concat({
          type: 'position',
          data: suggestion,
        });
      } else if ('id' in suggestion) {
        return acc.concat({
          type: 'language',
          data: suggestion,
        });
      } else {
        return acc;
      }
    }, [] as SuggestionsResult);
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
