import Fuse, { FuseResult } from 'fuse.js';
import { User } from '@/models/business/User';
import { SearchService } from '@/services/search';
import { Language } from '@/models/business/Language';
import { UserRepository } from '@/repository/user.repository';
import { LanguageRepository } from '@/repository/language.repository';

export class FuseSearchService implements SearchService {
  private readonly userRepository: UserRepository;
  private readonly languageRepository: LanguageRepository;
  private readonly usersByName: Promise<Fuse<User>>;
  private readonly usersByPosition: Promise<Fuse<User>>;
  private readonly positions: Promise<Fuse<string>>;
  private readonly languages: Promise<Fuse<Language>>;

  private static KEYWORD_SUGGESTION_LIMIT = 2;

  constructor(
    userRepository: UserRepository,
    languageRepository: LanguageRepository,
    usersByName: Promise<Fuse<User>>,
    usersByPosition: Promise<Fuse<User>>,
    positions: Promise<Fuse<string>>,
    languages: Promise<Fuse<Language>>,
  ) {
    this.userRepository = userRepository;
    this.languageRepository = languageRepository;
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

  public async index(): Promise<boolean> {
    const [users, positions, languages] = await Promise.all([
      this.userRepository.all(),
      this.userRepository.allPositions(),
      this.languageRepository.all(),
    ]);

    (await this.usersByName).setCollection(users);
    (await this.usersByPosition).setCollection(users);
    (await this.positions).setCollection(positions);
    (await this.languages).setCollection(languages);

    return true;
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
