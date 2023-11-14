import { User } from '@/modules/users/domain/User';

export interface UserPagination {
  data: User[];
  totalPages: number;
}
