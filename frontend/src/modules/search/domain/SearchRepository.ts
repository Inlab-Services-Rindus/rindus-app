import { Suggestion } from '@/modules/search/domain/Suggestion';
import { UserExtended } from '@/modules/users/domain/User';

export interface SearchRepository {
  getSuggestion: (query: string) => Promise<Suggestion>;
  getResults: (query: string, isFull: boolean) => Promise<UserExtended[]>;
}
