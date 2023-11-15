import { Item, Suggestion } from '@/modules/search/domain/Suggestion';
import { UserExtended } from '@/modules/users/domain/User';

export const setTagsAndUsers = (data: Suggestion) => {
  const tagNames: Item[] = [];
  const userItems: UserExtended[] = [];

  if ('languageSuggestions' in data) {
    for (const suggestion of data.languageSuggestions) {
      tagNames.push(suggestion);
    }
  }

  if ('positionSuggestions' in data) {
    for (const suggestion of data.positionSuggestions) {
      tagNames.push(suggestion);
    }
  }

  if ('userSuggestions' in data) {
    userItems.push(...data.userSuggestions);
  }

  return { tagNames, userItems };
};
