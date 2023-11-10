import { User } from '@/models/api/User';

export type SuggestionsResult = (
  | LanguageSuggestion
  | PositionSuggestion
  | UserSuggestions
)[];

export interface LanguageSuggestion {
  type: 'language';
  data: Language;
}

export interface Language {
  id: number;
  name: string;
}

export interface PositionSuggestion {
  type: 'position';
  data: string;
}

export type UserSuggestions = SuggestionUser[];

export interface SuggestionUser extends User {
  position: string;
}
