import { config } from '@/config/config';

import { AuthRepository } from '@/modules/auth//domain/AuthRepository';
import { AuthUser } from '@/modules/auth/domain/AuthUser';

export function createAuthRepository(): AuthRepository {
  return {
    login,
    softLogin,
    logout,
  };
}

export async function login(jwt: string) {
  try {
    const response = await fetch(`${config.backendUrl}/login`, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ jwt }),
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Error logging in');
    }
    const user = (await response.json()) as Promise<AuthUser>;
    return user;
  } catch (error) {
    throw new Error('Error logging in');
  }
}

export async function softLogin() {
  try {
    const response = await fetch(`${config.backendUrl}/soft-login`, {
      credentials: 'include',
    });

    if (response.status === 401) {
      throw new Error('Login expired');
    }

    if (response.status === 200) {
      const user = (await response.json()) as Promise<AuthUser>;
      return user;
    }
  } catch (error) {
    throw new Error('Error soft logging in');
  }
}

export async function logout() {
  try {
    const response = await fetch(`${config.backendUrl}/logout`, {
      credentials: 'include',
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Error logging in');
    }
    return true;
  } catch (error) {
    throw new Error('Error soft logging in');
  }
}
