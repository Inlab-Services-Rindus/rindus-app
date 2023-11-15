import { UserPagination } from '@/modules/users/domain/UserPagination';
import { UserRepository } from '@/modules/users/domain/UserRepository';

export async function getAllUsers(
  userRepository: UserRepository,
  page: number,
): Promise<UserPagination> {
  return userRepository.getAll(page);
}
