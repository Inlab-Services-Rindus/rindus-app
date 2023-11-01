import { LoggedInUser } from '@/models/api/User';

export interface UserResult extends LoggedInUser {
  fullName: string;
  isBirthday: boolean;
  position?: string;
}
