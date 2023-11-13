import { User } from '@/models/business/User';

export interface Suggestions {
  languages: TagSuggestion[];
  positions: TagSuggestion[];
  users: User[];
}

export interface TagSuggestion {
  display: string;
  query: string;
}
