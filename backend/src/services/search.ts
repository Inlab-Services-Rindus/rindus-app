import { KeywordSuggestion } from '@/models/business/Suggestions';
import { User } from '@/models/business/User';

export interface SearchService {
  searchUsers(_query: string): Promise<User[]>;
  suggestPositions(_query: string): Promise<KeywordSuggestion[]>;
  suggestLanguages(_query: string): Promise<KeywordSuggestion[]>;
}
