import { SearchRepository } from '@/modules/search/domain/SearchRepository';
import { Suggestion } from '@/modules/search/domain/Suggestion';

export async function getSuggestion(
  searchRepository: SearchRepository,
  query: string,
): Promise<Suggestion> {
  return searchRepository.getSuggestion(query);
}
