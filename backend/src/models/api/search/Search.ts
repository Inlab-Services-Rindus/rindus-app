import { User } from '@/models/api/User';

export interface UserResult extends User {
  position: string;
}
