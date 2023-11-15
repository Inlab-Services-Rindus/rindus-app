import { config } from '@/config/config';
import { UserExtended } from '@/modules/users/domain/User';
import { UserPagination } from '@/modules/users/domain/UserPagination';
import { UserRepository } from '@/modules/users/domain/UserRepository';

export function createUserRepository(): UserRepository {
  return {
    getAll,
    get,
  };
}

export async function getAll(page: number) {
  try {
    const response = await fetch(`${config.backendUrl}/users?page=${page}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Error fetching users');
    }
    const users = (await response.json()) as Promise<UserPagination>;
    return users;
  } catch (error) {
    throw new Error('Error fetching users');
  }
}

export async function get(id: string) {
  try {
    const response = await fetch(`${config.backendUrl}/users/${id}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Error fetching user');
    }
    const user = (await response.json()) as Promise<UserExtended>;
    return user;
  } catch (error) {
    throw new Error('Error fetching user');
  }
}
