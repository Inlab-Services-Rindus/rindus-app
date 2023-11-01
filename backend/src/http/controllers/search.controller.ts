import { UserResultConverter } from '@/converters/api/User.converter';
import { UserResult } from '@/models/api/search/Search';
import { UserSearch } from '@/services/search';
import { Request, Response } from 'express';

export class SearchController {
  private readonly userSearchService: UserSearch;

  private readonly userResultConverter: UserResultConverter;

  constructor(userSearchService: UserSearch) {
    this.userSearchService = userSearchService;
    this.userResultConverter = new UserResultConverter();
  }

  public async suggestions(request: Request, response: Response) {
    const results = (await this.doSearch(request)).slice(0, 5);

    return response.send(results);
  }

  public async search(request: Request, response: Response) {
    const results = await this.doSearch(request);

    return response.send(results);
  }

  private async doSearch(request: Request): Promise<UserResult[]> {
    const query = request.query.query;
    if (typeof query !== 'string') {
      return Promise.resolve([]);
    }

    const results = await this.userSearchService.search(query);

    return results.map((user) => this.userResultConverter.convert(user));
  }
}
