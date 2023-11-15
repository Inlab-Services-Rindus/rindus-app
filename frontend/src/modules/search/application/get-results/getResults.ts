import { SearchRepository } from '@/modules/search/domain/SearchRepository';
import { UserExtended } from '@/modules/users/domain/User';

export async function getResults(
  searchRepository: SearchRepository,
  query: string,
  isFull: boolean,
): Promise<UserExtended[]> {
  return searchRepository.getResults(query, isFull);
}
