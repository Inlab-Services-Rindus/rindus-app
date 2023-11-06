import { MinimalUser } from '@/models/api/User';

export interface UserResult extends MinimalUser {
  isBirthday: boolean;
  position?: string;
}
