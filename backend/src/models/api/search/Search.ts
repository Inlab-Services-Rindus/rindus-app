import { LoggedInUser } from '@/models/api/LoggedInUser';

export interface UserResult extends LoggedInUser {
  fullName: string;
  isBirthday: boolean;
  position?: string;
}
