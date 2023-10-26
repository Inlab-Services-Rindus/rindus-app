export interface LanguageRepository {
  userLanguagesById(_userId: string): Promise<string[]>;
}
