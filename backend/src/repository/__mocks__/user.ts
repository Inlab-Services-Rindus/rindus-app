import { mockUser } from '@/models/__mocks__/business/User';
import { User } from '@/models/business/User';
import { UserRepository } from '@/repository/user.repository';

export const mockFindUserByEmail = jest.fn().mockReturnValue(mockUser);
export const mockFindUserById = jest.fn().mockReturnValue(mockUser);
export const mockAll = jest.fn().mockReturnValue([]);

export class MockUserRepository implements UserRepository {
  findUserByEmail: (_email: string) => Promise<User | undefined> =
    mockFindUserByEmail;
  findUserById: (_id: string) => Promise<User | undefined> = mockFindUserById;
  all: () => Promise<User[]> = mockAll;
}
