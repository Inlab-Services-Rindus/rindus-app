import { User } from '@/model/business/User';
import { UserRepository } from '@/repository/user';

export const mockFindUserId = jest.fn().mockReturnValue('userId');
export const mockAll = jest.fn().mockReturnValue([]);

export class MockUserRepository implements UserRepository {
  findUserId: (_email: string) => Promise<string | undefined> = mockFindUserId;
  all: () => Promise<User[]> = mockAll;
}
