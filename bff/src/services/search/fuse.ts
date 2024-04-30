import Fuse, { FuseResult } from 'fuse.js';
import { User } from '@/models/business/User';
import { SearchService } from '@/services/search';
import { Language } from '@/models/business/Language';

export class FuseSearchService implements SearchService {
  private readonly usersByName: Promise<Fuse<User>>;
  private readonly usersByPosition: Promise<Fuse<User>>;
  private readonly positions: Promise<Fuse<string>>;
  private readonly languages: Promise<Fuse<Language>>;

  private static KEYWORD_SUGGESTION_LIMIT = 2;

  constructor(
    usersByName: Promise<Fuse<User>>,
    usersByPosition: Promise<Fuse<User>>,
    positions: Promise<Fuse<string>>,
    languages: Promise<Fuse<Language>>,
  ) {
    this.usersByName = usersByName;
    this.usersByPosition = usersByPosition;
    this.positions = positions;
    this.languages = languages;
  }
  public async searchUsersByPosition(query: string): Promise<User[]> {
    const results = (await this.usersByPosition).search(
      this.advancedQuery(query),
    );

    return this.mapFuseResult(results);
  }

  public async suggestPositions(query: string): Promise<string[]> {
    const results = (await this.positions).search(
      this.advancedQuery(query),
      this.suggestionOptions(),
    );

    return this.mapFuseResult(results);
  }

  public async suggestLanguages(query: string): Promise<Language[]> {
    const results = (await this.languages).search(
      this.advancedQuery(query),
      this.suggestionOptions(),
    );

    return this.mapFuseResult(results);
  }

  public async suggestUsers(query: string): Promise<User[]> {
    const results = (await this.usersByName).search(this.advancedQuery(query), {
      limit: 5,
    });

    return this.mapFuseResult(results);
  }

  public async searchUsers(query: string): Promise<User[]> {
    const results = (await this.usersByName).search(this.advancedQuery(query));

    return this.mapFuseResult(results);
  }

  private advancedQuery(query: string) {
    return `'"${query}"`;
  }

  private mapFuseResult<T>(results: FuseResult<T>[]) {
    return results.map((result) => result.item);
  }

  private suggestionOptions() {
    return { limit: FuseSearchService.KEYWORD_SUGGESTION_LIMIT };
  }
}
