export interface LoggedInUser {
  id: string;
  profilePictureUrl: string;
}

export interface User extends LoggedInUser {
  firstName: string;
  lastName?: string;
  fullName: string;
  email: string;
  isBirthday: boolean;
}

export interface IndexUser extends User {}

export interface ShowUser extends User {
  languages: string[];
  office: string;
  partner?: string;
  position?: string;
}

export interface UserResult extends LoggedInUser {
  fullName: string;
  isBirthday: boolean;
  position?: string;
}

export interface PaginatedIndex {
  users: IndexUser[];
  totalPages: number;
}
