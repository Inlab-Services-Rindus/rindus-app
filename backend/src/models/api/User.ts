import { LoggedInUser } from '@/models/api/LoggedInUser';

export interface User extends LoggedInUser {
  firstName: string;
  lastName?: string;
  fullName: string;
  email: string;
  isBirthday: boolean;
}
