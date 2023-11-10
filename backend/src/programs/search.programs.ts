import { Suggestions } from '@/models/business/Suggestions';
import { User } from '@/models/business/User';
import { SearchService } from '@/services/search';

export class SearchPrograms {
  private readonly searchService: SearchService;

  constructor(searchService: SearchService) {
    this.searchService = searchService;
  }

  public async suggestions(query: string): Promise<Suggestions> {
    const [languages, positions, users] = await Promise.all([
      this.searchService.suggestLanguages(query),
      this.searchService.suggestPositions(query),
      this.searchService.searchUsers(query),
    ]);

    return [...languages, ...positions, users];
  }

  public async search(query: string): Promise<User[]> {
    return await this.searchService.searchUsers(query);
  }
}
