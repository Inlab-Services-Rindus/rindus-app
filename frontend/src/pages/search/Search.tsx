import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import SearchBox from '@/atoms/search-box/SearchBox';
import Tag from '@/atoms/tag/Tag';
import { config } from '@/config/config';
import { setTagsAndUsers } from '@/helpers/searchHelpers';
import type { SearchResponse, UserItem } from '@/model/Result';
import Retry from '@/organisms/retry/Retry';
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
  const [error, setError] = useState<unknown>('');
  const [debouncedQuery] = useDebounce(query, 400);
  const noResults = !tags.length && !users.length;

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
        const { tagNames, userItems } = setTagsAndUsers(data);
        setTags(tagNames);
        setUsers(userItems);
      } catch (error) {
        setError(error);
        console.error('Error fetching suggestions:', error);
      }
    };

    if (debouncedQuery) {
      fetchData();
    } else {
      setTags([]);
      setUsers([]);
    }
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

  const renderResults = () => (
    <div style={{ width: '100%' }}>
      {search && (
        <Tag
          key={search}
          handleClick={handleClick}
          tag={search}
          noResults={noResults}
        />
      )}
      {tags?.map((item: string) => (
        <Tag key={item} handleClick={handleClick} tag={item} />
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
    </div>
  );

  return (
    <>
      <div className="search-container">
        <SearchBox inputHandler={handleInput} inputValue={inputValue} />
      </div>
      {error ? <Retry refresh={() => navigate('/search')} /> : renderResults()}
    </>
  );
}
