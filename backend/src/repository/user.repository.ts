import { LoggedInUser, User, WithInfo } from '@/models/business/User';

export interface UserRepository {
  all(): Promise<User[]>;
  page(_page: number): Promise<User[]>;
  findUserByEmail(_email: string): Promise<LoggedInUser | undefined>;
  findUserById(_id: string): Promise<LoggedInUser | undefined>;
  findUserWithInfoById(_id: string): Promise<(User & WithInfo) | undefined>;
  totalPages(): Promise<number>;
}
