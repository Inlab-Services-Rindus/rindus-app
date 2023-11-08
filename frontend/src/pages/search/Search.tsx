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
  const [hasError, setHasError] = useState<boolean>(false);
  const [debouncedQuery] = useDebounce(query, 400);
  const [noResults, setNoResults] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setHasError(false);
        const response = await fetch(
          encodeURI(`${config.backendUrl}/suggestions?query=${query}`),
          {
            credentials: 'include',
          },
        );
        const data = (await response.json()) as SearchResponse;
        const { tagNames, userItems } = setTagsAndUsers(data);
        console.log(tagNames, 'esto es lo que se pinta');

        setNoResults(!tagNames.length && !userItems.length);
        setTags(tagNames);
        setUsers(userItems);
      } catch (error) {
        setHasError(true);
        console.error('Error fetching suggestions:', error);
      }
    };

    if (debouncedQuery) {
      fetchData();
    } else {
      setTags([]);
      setUsers([]);
      setNoResults(false);
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

  const renderTag = (tagName: string) => (
    <div key={tagName} className="tag__container">
      <button className="tag__button" onClick={() => handleClick(tagName)}>
        <Tag tag={tagName.toUpperCase()} />
      </button>
    </div>
  );

  const renderResults = () => (
    <div style={{ width: '100%' }}>
      <div className="search__tag">
        {search && renderTag(search)}
        {tags?.map((item: string) => renderTag(item))}
      </div>
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

  const renderNoResults = () => (
    <div className="no-result">
      <p className="no-result__text">No results found for {query}.</p>
    </div>
  );

  return (
    <>
      <div className="search-container">
        <SearchBox inputHandler={handleInput} inputValue={inputValue} />
        {hasError && <Retry refresh={() => navigate('/search')} />}
        {noResults && renderNoResults()}
        {!noResults && renderResults()}
      </div>
    </>
  );
}
