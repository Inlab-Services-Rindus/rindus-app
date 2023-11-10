import { Page } from '@/models/business/Pagination';
import {
  LoggedInUser,
  User,
  WithInfo,
  WithLanguages,
} from '@/models/business/User';

export interface UserRepository {
  all(): Promise<User[]>;
  page(
    _page: number,
    sessionUserId: number,
    _pageSize?: number,
  ): Promise<Page<User>>;
  findUserByEmail(_email: string): Promise<LoggedInUser | undefined>;
  findUserById(_id: number): Promise<LoggedInUser | undefined>;
  findUserWithInfo(
    _id: number,
  ): Promise<(User & WithInfo & WithLanguages) | undefined>;
}
