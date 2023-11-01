import { User } from '@/models/business/User';

export type Suggestion = KeywordSuggestion | UsersSuggestion;

export interface KeywordSuggestion {
  keyword: string;
}

export interface UsersSuggestion {
  users: User[];
}
