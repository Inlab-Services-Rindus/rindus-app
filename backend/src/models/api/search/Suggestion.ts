import { User } from '@/models/api/User';

export interface SuggestionsResult {
  languageSuggestions: TagSuggestion[];
  positionSuggestions: TagSuggestion[];
  userSuggestions: SuggestionUser[];
}

export interface TagSuggestion {
  display: string;
  query: string;
}

export interface SuggestionUser extends User {
  position: string;
}
