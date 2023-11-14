import { AuthRepository } from '@/modules/auth/domain/AuthRepository';

export async function logout(authRepository: AuthRepository): Promise<boolean> {
  return authRepository.logout();
}
