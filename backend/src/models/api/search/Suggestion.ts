import { User } from '@/models/api/User';

export type Suggestions = Suggestion[];

export interface Suggestion {
  type: 'keyword' | 'freetext';
  data: string | SuggestionUser[];
}

export interface SuggestionUser extends User {
  position: string;
}
