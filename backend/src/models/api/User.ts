export interface LoggedInUser {
  id: string;
  profilePictureUrl: string;
}

export interface User extends LoggedInUser {
  firstName: string;
  lastName?: string;
  fullName: string;
  email: string;
}

export interface IndexUser extends User {
  isBirthday: boolean;
}

export interface ShowUser extends User {
  languages: string[];
  office: string;
  partner?: string;
  position?: string;
}
