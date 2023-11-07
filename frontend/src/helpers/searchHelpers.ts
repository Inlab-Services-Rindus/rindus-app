import type { SearchItem, UserItem } from '@/model/Result';

export const setTagsAndUsers = (data: SearchItem[]) => {
  const tagNames: string[] = [];
  const userItems: UserItem[] = [];

  data.forEach((item: SearchItem) => {
    if (item.type === 'keyword' && typeof item.data === 'string') {
      tagNames.push(item.data);
    } else if (item.type === 'freetext' && Array.isArray(item.data)) {
      userItems.push(...item.data);
    }
  });

  return { tagNames, userItems };
};
