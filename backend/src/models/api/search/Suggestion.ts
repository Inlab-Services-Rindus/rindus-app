export type Suggestions = Suggestion[];

export interface Suggestion {
  type: 'keyword' | 'freetext';
  data: string | SuggestionUser[];
}

export interface SuggestionUser {
  id: number;
  fullName: string;
  position?: string;
}
