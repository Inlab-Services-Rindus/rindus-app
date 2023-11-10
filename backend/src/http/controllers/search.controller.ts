import { SuggestionsResultConverter } from '@/converters/api/Search.converter';
import { UserResultConverter } from '@/converters/api/User.converter';
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
    const maybeQuery = this.parseQuery(request);

    if (maybeQuery) {
      const results = await this.searchPrograms.suggestions(maybeQuery);

      const suggestions = this.suggestionsResultConverter.convert(results);

      return response.send(suggestions);
    }

    return response.send([]);
  }

  public async search(request: Request, response: Response) {
    const maybeQuery = this.parseQuery(request);

    if (maybeQuery) {
      const users = await this.searchPrograms.search(maybeQuery);

      const results = users.map((user) =>
        this.userResultConverter.convert(user),
      );

      return response.send(results);
    }

    return response.send([]);
  }

  private parseQuery(request: Request) {
    const query = request.query.query;

    if (typeof query !== 'string') {
      return undefined;
    }

    return query;
  }
}
