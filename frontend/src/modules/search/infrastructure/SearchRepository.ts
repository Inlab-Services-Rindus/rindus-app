import { config } from '@/config/config';

import { SearchRepository } from '@/modules/search/domain/SearchRepository';
import { Suggestion } from '@/modules/search/domain/Suggestion';
import { UserExtended } from '@/modules/users/domain/User';

export function createSearchRepository(): SearchRepository {
  return {
    getSuggestion,
    getResults,
  };
}

export async function getSuggestion(query: string) {
  try {
    const response = await fetch(
      `${config.backendUrl}/suggestions?query=${encodeURIComponent(query)}`,
      {
        credentials: 'include',
      },
    );

    if (!response.ok) {
      throw new Error('Error getting suggestions');
    }

    const suggestion = response.json() as Promise<Suggestion>;
    return suggestion;
  } catch (error) {
    throw new Error('Error getting suggestions');
  }
}

export async function getResults(query: string, isFull: boolean) {
  try {
    const response = await fetch(
      isFull
        ? query
        : `${config.backendUrl}/search?query=${encodeURIComponent(query)}`,
      {
        credentials: 'include',
      },
    );

    if (!response.ok) {
      throw new Error('Error getting results');
    }

    const results = response.json() as Promise<UserExtended[]>;
    return results;
  } catch (error) {
    throw new Error('Error getting results');
  }
}
