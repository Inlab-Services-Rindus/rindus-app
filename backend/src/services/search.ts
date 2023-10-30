import { User } from '@/models/business/User';

export interface UserSearch {
  search(_query: string): Promise<User[]>;
}
