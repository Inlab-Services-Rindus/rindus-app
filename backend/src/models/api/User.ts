export interface User extends MinimalUser {
  firstName: string;
  lastName?: string;
  email: string;
  isBirthday: boolean;
}

export interface MinimalUser {
  id: number;
  profilePictureUrl: string;
}
