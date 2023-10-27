import { Language } from '@/models/business/Language';

export interface LanguageRepository {
  userLanguagesById(_userId: string): Promise<Language[]>;
}
