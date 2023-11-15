export interface Suggestions {
  languageSuggestions: LanguageItem[];
  positionSuggestions: PositionItem[];
  userSuggestions: UserItem[];
}
export interface LanguageItem {
  display: string;
  query: string;
}

export interface PositionItem {
  display: string;
  query: string;
}

export interface Search {
  display: string;
  query: string;
}

export interface UserItem {
  id: number;
  profilePictureUrl: string;
  email: string;
  firstName: string;
  lastName: string;
  position: string;
  isBirthday: boolean;
}

interface UserItems {
  type: string;
  data: UserItem[];
}

export type SuggestionItems = LanguageItem | PositionItem;

interface TagResponse {
  type: string;
  data: string;
}

interface FreetextResponse {
  type: string;
  data: UserItem[];
}

export type SearchResponse = (TagResponse | FreetextResponse)[];
