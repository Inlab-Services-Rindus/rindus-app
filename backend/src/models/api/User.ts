export interface User {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  profilePictureUrl: string;
  isBirthday?: boolean;
}

export interface UserLogin extends Pick<User, 'id' | 'profilePictureUrl'> {}
