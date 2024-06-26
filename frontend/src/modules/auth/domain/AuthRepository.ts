import { AuthUser } from '@/modules/auth/domain/AuthUser';

export interface AuthRepository {
  login: (jwt: string) => Promise<AuthUser>;
  softLogin: () => Promise<AuthUser | undefined>;
  logout: () => Promise<boolean>;
}
