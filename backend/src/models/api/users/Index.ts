import { Pagination } from '@/models/api/Pagination';
import { User } from '@/models/api/User';

export interface UsersIndexPage extends Pagination<IndexUser> {}

export interface IndexUser extends User {
  isCaptain: boolean;
}
