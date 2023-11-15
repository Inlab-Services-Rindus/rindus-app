import { Language } from '@/models/business/Language';
import { User } from '@/models/business/User';

export interface SearchService {
  searchUsers(query: string): Promise<User[]>;
  suggestUsers(query: string): Promise<User[]>;
  suggestPositions(query: string): Promise<string[]>;
  suggestLanguages(query: string): Promise<Language[]>;
  searchUsersByPosition(query: string): Promise<User[]>;
}
