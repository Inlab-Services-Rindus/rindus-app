export interface TagItem {
  type: string;
  data: string;
}

export interface UserItem {
  id: string;
  profilePictureUrl: string;
  firstName: string;
  lastName?: string;
  position: string;
}

interface UserItems {
  type: string;
  data: UserItem[];
}

export type SearchItem = TagItem | UserItems;

interface TagResponse {
  type: string;
  data: string;
}

interface FreetextResponse {
  type: string;
  data: UserItem[];
}

export type SearchResponse = (TagResponse | FreetextResponse)[];
