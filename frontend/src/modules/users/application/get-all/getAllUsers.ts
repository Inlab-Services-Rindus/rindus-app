import { UserPagination } from '@/modules/users/domain/UserPagination';
import { UserRepository } from '@/modules/users/domain/UserRepository';

export async function getAllUsers(
  userRepository: UserRepository,
  page: number,
  pageSize: number,
): Promise<UserPagination> {
  return userRepository.getAll(page, pageSize);
}
