import { useState, useEffect, useContext } from 'react';

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

import { StoreContext } from '@/ui/context/store/Store';

import { setTagsAndUsers } from '@/ui/helpers/searchHelpers';

import '@/ui/section/search/Search.scss';

export function Search(): JSX.Element {
  const { setSearch, search } = useContext(StoreContext);

  const [query, setQuery] = useState<string>('');

  const [inputValue, setInputValue] = useState<string>('');
  const [debouncedQuery] = useDebounce(query, 400);
  const [noResults, setNoResults] = useState<boolean>(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const searchRepository = createSearchRepository();

  useEffect(() => {
    setInputValue(search.search.display.toUpperCase());
    setSearch({
      tags: search.tags,
      results: search.results,
      search: search.search,
      users: search.users,
    });
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
      setSearch((prevSearch) => ({
        ...prevSearch,
        tags: tagNames,
        users: userItems,
        results: [],
      }));
    } catch (error) {
      setHasError(true);
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.toUpperCase();
    setNoResults(false);
    setInputValue(newValue);
    setQuery(newValue);
    setSearch({
      tags: [],
      users: [],
      results: [],
      search: { display: newValue, query: newValue },
    });
  };

  const handleClick = async (item: Item, custom?: boolean) => {
    const query = custom ? item.display : item.query;

    try {
      setIsLoading(true);
      const results = await getResults(searchRepository, query, !custom);
      setIsLoading(false);
      if (results.length === 0) {
        setNoResults(true);
        setSearch((prevSearch) => ({
          ...prevSearch,
          display: item.display,
          query: item.query,
        }));
      }
      setSearch({
        tags: [],
        users: [],
        results: results,
        search: { display: item.display, query: item.query },
      });
      setInputValue(item.display.toUpperCase());
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
    if (event.key === 'Enter' && search.search && !noResults) {
      console.log('entro');
      handleClick(search.search, true);
    }
  };

  const renderResults = () => {
    if (search.results?.length > 0) {
      return (
        <div className="result">
          <div className="result__tag">
            <div>
              <span className="result__tag__text">Results for: </span>
            </div>
            <div>
              {search.search?.display && (
                <Tag tag={search.search.display.toUpperCase()} />
              )}
            </div>
          </div>
          {search?.results?.map((user: UserExtended) => (
            <UserCard
              id={user.id}
              key={user.id}
              profilePictureUrl={user.profilePictureUrl}
              firstName={user.firstName}
              lastName={user.lastName}
              position={user.position}
              isBirthday={user.isBirthday}
              isCaptain={user.isCaptain}
            />
          ))}
        </div>
      );
    }

    if (
      search?.results?.length === 0 &&
      (search.users.length > 0 || search.tags.length > 0) &&
      search?.search.display
    ) {
      return (
        <div className="search">
          <div className="search__tag">
            {search?.search?.display && renderTag(search.search, true)}
            {search?.tags?.map((item: Item) => renderTag(item))}
          </div>
          {search?.users?.map((user: UserExtended) => (
            <UserCard
              key={user.id}
              id={user.id}
              profilePictureUrl={user.profilePictureUrl}
              firstName={user.firstName}
              lastName={user.lastName}
              position={user.position}
              isBirthday={user.isBirthday}
              isCaptain={user.isCaptain}
              size="small"
            />
          ))}
        </div>
      );
    }
  };

  const renderNoResults = () => (
    <div className="no-result">
      <p className="no-result__text">
        No results found for {search?.search?.display}.
      </p>
    </div>
  );

  const handleClose = () => {
    setQuery('');
    setInputValue('');
    setSearch({
      tags: [],
      users: [],
      results: [],
      search: { display: '', query: '' },
    });
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
