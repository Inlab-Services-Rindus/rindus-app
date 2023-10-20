import { mockUser } from '@/model/__mocks__/business/User';
import { User } from '@/model/business/User';
import { UserRepository } from '@/repository/user.repository';

export const mockFindUser = jest.fn().mockReturnValue(mockUser);
export const mockAll = jest.fn().mockReturnValue([]);

export class MockUserRepository implements UserRepository {
  findUser: (_email: string) => Promise<User | undefined> = mockFindUser;
  all: () => Promise<User[]> = mockAll;
}
