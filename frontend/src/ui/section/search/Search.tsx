import { useState, useEffect } from 'react';

import SearchBox from '@/ui/components/atoms/search-box/SearchBox';
import Tag from '@/ui/components/atoms/tag/Tag';
import Section from '@/ui/components/molecules/section/Section';
import UserCard from '@/ui/components/organisms/user-card/UserCard';
import { useDebounce } from 'use-debounce';

import { getResults } from '@/modules/search/application/get-results/getResults';
import { getSuggestion } from '@/modules/search/application/get-suggestion/getSuggestion';
import { Item } from '@/modules/search/domain/Suggestion';
import { createSearchRepository } from '@/modules/search/infrastructure/SearchRepository';
import { UserExtended } from '@/modules/users/domain/User';

import { setTagsAndUsers } from '@/ui/helpers/searchHelpers';

import '@/ui/section/search/Search.scss';

export function Search(): JSX.Element {
  const [query, setQuery] = useState<string>('');
  const [search, setSearch] = useState<Item>();
  const [tags, setTags] = useState<Item[]>([]);
  const [users, setUsers] = useState<UserExtended[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [debouncedQuery] = useDebounce(query, 400);
  const [noResults, setNoResults] = useState<boolean>(false);
  const [results, setResults] = useState<UserExtended[]>([]);

  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const searchRepository = createSearchRepository();

  useEffect(() => {
    if (debouncedQuery) {
      fetchSuggestions();
    }
  }, [debouncedQuery]);

  const fetchSuggestions = async () => {
    try {
      setHasError(false);
      setIsLoading(true);
      const suggestion = await getSuggestion(searchRepository, query);
      setIsLoading(false);
      const { tagNames, userItems } = setTagsAndUsers(suggestion);

      setNoResults(!tagNames.length && !userItems.length);
      setTags(tagNames);
      setUsers(userItems);
    } catch (error) {
      setHasError(true);
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

  const handleClick = async (item: Item, custom?: boolean) => {
    const query = custom ? item.display : item.query;

    try {
      setIsLoading(true);
      const results = await getResults(searchRepository, query, !custom);
      setIsLoading(false);
      if (results.length === 0) {
        setNoResults(true);
        setSearch({ display: item.display, query: item.query });
      }
      setSearch({ display: item.display, query: item.query });
      setResults(results);
      setTags([]);
      setUsers([]);
    } catch (error) {
      setHasError(true);
    }
  };

  const renderTag = (item: Item, custom?: boolean) => (
    <div key={item.query} className="tag__container">
      <button className="tag__button" onClick={() => handleClick(item, custom)}>
        <Tag tag={item.display.toUpperCase()} />
      </button>
    </div>
  );

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && search && !noResults) {
      console.log('entro');
      handleClick(search, true);
    }
  };

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
          {results?.map((user: UserExtended) => (
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
            {tags?.map((item: Item) => renderTag(item))}
          </div>
          {users?.map((user: UserExtended) => (
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

  const handleClose = () => {
    setQuery('');
    setInputValue('');
    setTags([]);
    setUsers([]);
    setSearch({ display: '', query: '' });
    setResults([]);
  };

  return (
    <div className="search-container">
      <SearchBox
        inputHandler={handleInput}
        inputValue={inputValue}
        closeHandler={handleClose}
        enterHandler={handleEnter}
      />
      <Section
        dataTestId="search"
        refresh={fetchSuggestions}
        isLoading={isLoading}
        shouldRefresh={hasError}
      >
        {noResults && renderNoResults()}
        {!noResults && renderResults()}
      </Section>
    </div>
  );
}
