import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import SearchBox from '@/atoms/search-box/SearchBox';
import Tag from '@/atoms/tag/Tag';
import { config } from '@/config/config';
import { SearchItem, SearchResponse, UserItem } from '@/model/Result';
import UserCard from '@/organisms/user-card/UserCard';
import '@/pages/search/Search.scss';

import { useDebounce } from 'use-debounce';

export function Search(): JSX.Element {
  const navigate = useNavigate();
  const [query, setQuery] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [debouncedQuery] = useDebounce(query, 400);

  const setTagsAndUsers = (data: SearchItem[]) => {
    const tags: string[] = [];

    data.forEach((item: SearchItem) => {
      if (item.type === 'keyword' && typeof item.data === 'string') {
        tags.push(item.data);
      } else if (item.type === 'freetext' && Array.isArray(item.data)) {
        setUsers(item.data);
      }
    });

    setTags(tags);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          encodeURI(`${config.backendUrl}/suggestions?query=${query}`),
          {
            credentials: 'include',
          },
        );
        const data = (await response.json()) as SearchResponse;
        setTagsAndUsers(data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    fetchData();
    setTags([]);
    setUsers([]);
  }, [debouncedQuery]);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    setSearch(newValue);
    setQuery(newValue);
  };

  const handleClick = async (query: string) => {
    navigate(`/search/${query}`);
  };

  return (
    <>
      <div className="search-container">
        <SearchBox inputHandler={handleInput} inputValue={inputValue} />
      </div>
      {search && (
        <Tag key={Math.random()} handleClick={handleClick} tag={search} />
      )}
      {tags?.map((item: string) => (
        <Tag key={Math.random()} handleClick={handleClick} tag={item} />
      ))}
      {users?.map((user: UserItem) => (
        <UserCard
          handleClick={handleClick}
          key={user.id}
          profilePictureUrl={user.profilePictureUrl}
          firstName={user.firstName}
          lastName={user.lastName}
          position={user.position}
          size="small"
        />
      ))}
    </>
  );
}
