import { config } from '@/config';
import { Language } from '@/models/business/Language';
import { Suggestions, TagSuggestion } from '@/models/business/Suggestions';
import { User } from '@/models/business/User';
import { UserRepository } from '@/repository/user.repository';
import { SearchService } from '@/services/search';

export class SearchPrograms {
  private readonly searchService: SearchService;
  private readonly userRepository: UserRepository;

  constructor(searchService: SearchService, userRepository: UserRepository) {
    this.searchService = searchService;
    this.userRepository = userRepository;
  }

  public async suggestions(query: string): Promise<Suggestions> {
    const [languages, positions, users] = await Promise.all([
      this.searchService.suggestLanguages(query),
      this.searchService.suggestPositions(query),
      this.searchService.suggestUsers(query),
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

  public async searchByLanguage(id: number): Promise<User[]> {
    return await this.userRepository.allByLanguage(id);
  }

  public async searchByPosition(query: string): Promise<User[]> {
    return await this.searchService.searchUsersByPosition(query);
  }

  public async search(query: string): Promise<User[]> {
    return await this.searchService.searchUsers(query);
  }
}
