import { UserExtended } from '@/modules/users/domain/User';

export interface Item {
  display: string;
  query: string;
}

export interface Suggestion {
  languageSuggestions: Item[];
  positionSuggestions: Item[];
  userSuggestions: UserExtended[];
}
