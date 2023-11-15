import { useState, useEffect } from 'react';

import SearchBox from '@/atoms/search-box/SearchBox';
import Tag from '@/atoms/tag/Tag';
import { config } from '@/config/config';
import { setTagsAndUsers } from '@/helpers/searchHelpers';
import type {
  LanguageItem,
  PositionItem,
  Suggestions,
  UserItem,
  Search,
  SuggestionItems,
} from '@/model/Result';
import UserCard from '@/organisms/user-card/UserCard';
import '@/pages/search/Search.scss';

import { useDebounce } from 'use-debounce';

export function Search(): JSX.Element {
  const [query, setQuery] = useState<string>('');
  const [search, setSearch] = useState<Search | undefined>();
  const [tags, setTags] = useState<LanguageItem[] | PositionItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [debouncedQuery] = useDebounce(query, 400);
  const [noResults, setNoResults] = useState<boolean>(false);
  const [results, setResults] = useState<UserItem[]>([]);

  useEffect(() => {
    if (debouncedQuery) {
      fetchSuggestions();
    }
  }, [debouncedQuery]);

  const fetchSuggestions = async () => {
    try {
      const response = await fetch(
        encodeURI(`${config.backendUrl}/suggestions?query=${query}`),
        {
          credentials: 'include',
        },
      );
      const data = (await response.json()) as Suggestions;
      const { tagNames, userItems } = setTagsAndUsers(data);

      setNoResults(!tagNames.length && !userItems.length);
      setTags(tagNames);
      setUsers(userItems);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.toUpperCase();
    setNoResults(false);
    setResults([]);
    setTags([]);
    setUsers([]);
    setInputValue(newValue);
    setSearch({ display: newValue, query: newValue });
    setQuery(newValue);
  };

  const handleClick = async (item: Search, custom?: boolean) => {
    const url = custom
      ? encodeURI(`${config.backendUrl}/search?query=${item.display}`)
      : item.query;
    const data = await fetch(url, {
      credentials: 'include',
    }).then((response) => response.json() as Promise<UserItem[]>);

    if (data.length === 0) {
      setNoResults(true);
      setSearch({ display: item.display, query: item.query });
    }
    setSearch({ display: item.display, query: item.query });
    setResults(data);
    setTags([]);
    setUsers([]);
  };

  const renderTag = (item: SuggestionItems | Search, custom?: boolean) => (
    <div key={item.query} className="tag__container">
      <button className="tag__button" onClick={() => handleClick(item, custom)}>
        <Tag tag={item.display.toUpperCase()} />
      </button>
    </div>
  );
  const renderResults = () => {
    if (results.length > 0) {
      return (
        <div className="result">
          <div className="result__tag">
            <div>
              <span className="result__tag__text">Results for: </span>
            </div>
            <div>
              {search?.display && <Tag tag={search.display.toUpperCase()} />}
            </div>
          </div>
          {results?.map((user: UserItem) => (
            <UserCard
              id={user.id}
              key={user.id}
              profilePictureUrl={user.profilePictureUrl}
              firstName={user.firstName}
              lastName={user.lastName}
              position={user.position}
            />
          ))}
        </div>
      );
    }

    if (
      results.length === 0 &&
      (users.length > 0 || tags.length > 0) &&
      search?.display
    ) {
      return (
        <div className="search">
          <div className="search__tag">
            {search?.display && renderTag(search, true)}
            {tags?.map((item: LanguageItem | PositionItem) => renderTag(item))}
          </div>
          {users?.map((user: UserItem) => (
            <UserCard
              key={user.id}
              id={user.id}
              profilePictureUrl={user.profilePictureUrl}
              firstName={user.firstName}
              lastName={user.lastName}
              position={user.position}
              size="small"
            />
          ))}
        </div>
      );
    }
  };

  const renderNoResults = () => (
    <div className="no-result">
      <p className="no-result__text">No results found for {search?.display}.</p>
    </div>
  );

  return (
    <>
      <div className="search-container">
        <SearchBox inputHandler={handleInput} inputValue={inputValue} />
        {noResults && renderNoResults()}
        {!noResults && renderResults()}
      </div>
    </>
  );
}
