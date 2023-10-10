import { User } from '@/model/business/User';

export interface UserRepository {
  findUserId: (_email: string) => Promise<string | undefined>;
  all: () => Promise<User[]>;
}
