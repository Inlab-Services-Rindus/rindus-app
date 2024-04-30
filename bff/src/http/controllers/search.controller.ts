import { SuggestionsResultConverter } from '@/converters/api/Search.converter';
import { UserResultConverter } from '@/converters/api/User.converter';
import { sanitise } from '@/helpers/RecordConverterHelper';
import {
  parseIdQueryParam,
  parseKeywordQueryParam,
  parseQueryQueryParam,
} from '@/helpers/RequestHelper';
import { User } from '@/models/business/User';
import { SearchPrograms } from '@/programs/search.programs';
import { Request, Response } from 'express';

export class SearchController {
  private readonly searchPrograms: SearchPrograms;

  private readonly userResultConverter: UserResultConverter;

  private readonly suggestionsResultConverter: SuggestionsResultConverter;

  constructor(searchPrograms: SearchPrograms) {
    this.searchPrograms = searchPrograms;
    this.userResultConverter = new UserResultConverter();
    this.suggestionsResultConverter = new SuggestionsResultConverter();
  }

  public async suggestions(request: Request, response: Response) {
    const maybeQuery = parseQueryQueryParam(request);

    if (maybeQuery) {
      const santisedQuery = sanitise(maybeQuery);
      const results = await this.searchPrograms.suggestions(santisedQuery);

      const suggestions = this.suggestionsResultConverter.convert(results);

      return response.send(suggestions);
    }

    return response.send([]);
  }

  public async search(request: Request, response: Response) {
    const maybeQuery = parseQueryQueryParam(request);
    const maybeKeyword = parseKeywordQueryParam(request);
    const maybeId = parseIdQueryParam(request);

    if (!maybeQuery && !maybeKeyword) {
      return response.sendStatus(400);
    }

    let users;
    const santisedQuery = sanitise(maybeQuery ?? '');
    switch (maybeKeyword) {
      case 'language':
        if (!maybeId) {
          return response.sendStatus(400);
        }

        users = await this.searchPrograms.searchByLanguage(maybeId);
        break;
      case 'position':
        if (!maybeQuery) {
          return response.sendStatus(400);
        }

        users = await this.searchPrograms.searchByPosition(santisedQuery);
        break;
      default:
        if (maybeQuery) {
          users = await this.searchPrograms.search(santisedQuery);
        } else {
          users = [] as User[];
        }
    }

    const results = users.map((user) => this.userResultConverter.convert(user));

    return response.send(results);
  }
}
