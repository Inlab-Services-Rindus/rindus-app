import { Page } from '@/models/business/Pagination';
import {
  LoggedInUser,
  User,
  UserAttendee,
  WithInfo,
  WithLanguages,
} from '@/models/business/User';

export interface UserRepository {
  all(): Promise<User[]>;
  page(
    page: number,
    pageSize: number,
    sessionUserId: number,
  ): Promise<Page<User>>;
  findUserByEmail(email: string): Promise<UserAttendee | undefined>;
  findUserById(id: number): Promise<LoggedInUser | undefined>;
  findUserWithInfo(
    id: number,
  ): Promise<(User & WithInfo & WithLanguages) | undefined>;
  allPositions(): Promise<string[]>;
  allByLanguage(languageId: number): Promise<User[]>;
}
