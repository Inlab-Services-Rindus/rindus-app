import { AuthRepository } from '@/modules/auth/domain/AuthRepository';
import { AuthUser } from '@/modules/auth/domain/AuthUser';

export async function softLogin(
  authRepository: AuthRepository,
): Promise<AuthUser> {
  return authRepository.softLogin();
}
