import { User } from '@/models/business/User';

export interface UserRepository {
  findUser: (_email: string) => Promise<User | undefined>;
  all: () => Promise<User[]>;
}
