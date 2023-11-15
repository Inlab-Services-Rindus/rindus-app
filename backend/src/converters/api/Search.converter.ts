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
    return {
      languageSuggestions: source.languages,
      positionSuggestions: source.positions,
      userSuggestions: source.users.map((user) =>
        this.suggestionUserConverter.convert(user),
      ),
    };
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
