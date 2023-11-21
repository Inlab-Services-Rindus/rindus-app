import { UserExtended } from '@/modules/users/domain/User';
import { UserPagination } from '@/modules/users/domain/UserPagination';

export interface UserRepository {
  getAll: (page: number, pageSize: number) => Promise<UserPagination>;
  get: (id: string) => Promise<UserExtended>;
}
