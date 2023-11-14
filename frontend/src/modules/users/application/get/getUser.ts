import { UserExtended } from '@/modules/users/domain/User';
import { UserRepository } from '@/modules/users/domain/UserRepository';

export async function getUser(
  userRepository: UserRepository,
  id: string,
): Promise<UserExtended> {
  return userRepository.get(id);
}
