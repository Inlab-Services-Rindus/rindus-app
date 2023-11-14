import { AuthRepository } from '@/modules/auth/domain/AuthRepository';
import { AuthUser } from '@/modules/auth/domain/AuthUser';

export async function login(
  authRepository: AuthRepository,
  jwt: string,
): Promise<AuthUser> {
  return authRepository.login(jwt);
}
