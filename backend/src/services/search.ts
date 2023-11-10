import { Language } from '@/models/business/Language';
import { User } from '@/models/business/User';

export interface SearchService {
  searchUsers(_query: string): Promise<User[]>;
  suggestUsers(_query: string): Promise<User[]>;
  suggestPositions(_query: string): Promise<string[]>;
  suggestLanguages(_query: string): Promise<Language[]>;
}
