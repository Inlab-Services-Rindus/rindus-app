import { config } from '@/config';
import { Language } from '@/models/business/Language';
import { Suggestions, TagSuggestion } from '@/models/business/Suggestions';
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

    return {
      languages: this.enrichQuery(languages),
      positions: this.enrichQuery(positions),
      users,
    };
  }

  private enrichQuery(tags: Language[] | string[]): TagSuggestion[] {
    return tags.map((tag) => this.calculateQuery(tag));
  }

  private calculateQuery(tag: Language | string): TagSuggestion {
    if (typeof tag === 'string') {
      return {
        display: tag,
        query: `${
          config.app.url
        }/search?keyword=position&query=${encodeURIComponent(tag)}`,
      };
    } else {
      return {
        display: tag.name,
        query: `${config.app.url}/search?keyword=language&id=${tag.id}`,
      };
    }
  }

  public async search(query: string): Promise<User[]> {
    return await this.searchService.searchUsers(query);
  }
}
