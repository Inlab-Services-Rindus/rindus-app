import Fuse from 'fuse.js';
import { User } from '@/models/business/User';
import { SearchService } from '@/services/search';
import { Language } from '@/models/business/Language';
import { KeywordSuggestion } from '@/models/business/Suggestions';

export class FuseSearchService implements SearchService {
  private readonly usersByName: Promise<Fuse<User>>;
  private readonly usersByPosition: Promise<Fuse<User>>;
  private readonly languages: Promise<Fuse<Language>>;

  private static KEYWORD_SUGGESTION_LIMIT = 2;

  constructor(
    usersByName: Promise<Fuse<User>>,
    usersByPosition: Promise<Fuse<User>>,
    languages: Promise<Fuse<Language>>,
  ) {
    this.usersByName = usersByName;
    this.usersByPosition = usersByPosition;
    this.languages = languages;
  }

  async suggestPositions(query: string): Promise<KeywordSuggestion[]> {
    const positions = (await this.usersByPosition)
      .search(query, this.suggestionOptions())
      .reduce(
        (acc, result) =>
          result.item.position ? acc.concat(result.item.position) : acc,
        [] as string[],
      );

    return this.toKeywordSuggestion(positions);
  }

  async suggestLanguages(query: string): Promise<KeywordSuggestion[]> {
    const languages = (await this.languages)
      .search(query, this.suggestionOptions())
      .map((result) => result.item);

    return this.toKeywordSuggestion(languages);
  }

  private toKeywordSuggestion(suggestions: string[]) {
    return suggestions.map((suggestion) => ({ keyword: suggestion }));
  }

  private suggestionOptions() {
    return { limit: FuseSearchService.KEYWORD_SUGGESTION_LIMIT };
  }

  async searchUsers(query: string): Promise<User[]> {
    return (await this.usersByName).search(query).map((result) => result.item);
  }
}
