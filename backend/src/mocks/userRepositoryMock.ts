import { UserRepository } from '@/repository/user.repository';

export const userRepositoryMock: jest.Mocked<UserRepository> = {
  all: jest.fn(),
  page: jest.fn(),
  findUserByEmail: jest.fn(),
  findUserById: jest.fn(),
  findUserWithInfo: jest.fn(),
  allPositions: jest.fn(),
  allByLanguage: jest.fn(),
};
