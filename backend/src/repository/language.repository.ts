import { Language } from '@/models/business/Language';

export interface LanguageRepository {
  all(): Promise<Language[]>;
}
