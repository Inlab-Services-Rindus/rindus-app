export interface IndexUser {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  profilePictureUrl: string;
  isBirthday: boolean;
}

export interface ShowUser extends IndexUser {
  languages: string[];
  office: string;
  partner?: string;
  position?: string;
}

export interface UserLogin
  extends Pick<IndexUser, 'id' | 'profilePictureUrl'> {}
