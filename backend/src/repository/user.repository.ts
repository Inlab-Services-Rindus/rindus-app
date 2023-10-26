import { User } from '@/models/business/User';

export interface UserRepository {
  all(): Promise<User[]>;
  findUserById(_id: string): Promise<User | undefined>;
  findUserByEmail(_email: string): Promise<User | undefined>;
}
