import type {
  Suggestions,
  UserItem,
  LanguageItem,
  PositionItem,
} from '@/model/Result';

export const setTagsAndUsers = (data: Suggestions) => {
  const tagNames: LanguageItem[] | PositionItem[] = [];
  const userItems: UserItem[] = [];

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
