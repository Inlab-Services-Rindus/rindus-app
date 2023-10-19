import { User } from '@/models/business/User';

export interface UserRepository {
  findUserByEmail: (_email: string) => Promise<User | undefined>;
  findUserById: (_id: string) => Promise<User | undefined>;
  all: () => Promise<User[]>;
}
