import { useState, useEffect, useContext } from 'react';

import SearchBox from '@/ui/components/atoms/search-box/SearchBox';
import Tag from '@/ui/components/atoms/tag/Tag';
import Section from '@/ui/components/molecules/section/Section';
import UserCard from '@/ui/components/organisms/user-card/UserCard';
import { useDebounce } from 'use-debounce';

import { Item } from '@/modules/search/domain/Suggestion';
import { UserExtended } from '@/modules/users/domain/User';

import { StoreContext } from '@/ui/context/store/Store';

import '@/ui/section/search/Search.scss';

export function Search(): JSX.Element {
  const {
    setSearchData,
    search,
    getSearchSuggestions,
    setQueryKey,
    getSearchResults,
    query,
  } = useContext(StoreContext);

  const [debouncedQuery] = useDebounce(query, 400);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [suggestionRequested, setSuggestionRequested] =
    useState<boolean>(false);

  const getSuggestions = async () => {
    setIsLoading(true);
    await getSearchSuggestions();
    setIsLoading(false);
  };

  useEffect(() => {
    if (debouncedQuery && suggestionRequested) {
      getSuggestions();
    }
  }, [debouncedQuery]);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.toUpperCase();
    setSuggestionRequested(true);
    setQueryKey(newValue);
    setSearchData({
      ...search,
      results: [],
      search: { display: newValue, query: newValue },
      noResults: false,
    });
  };

  const handleClick = async (item: Item, custom: boolean) => {
    setIsLoading(true);
    await getSearchResults(item, custom);
    setIsLoading(false);
  };

  const renderTag = (item: Item, custom?: any) => (
    <div key={item.query} className="tag__container">
      <button className="tag__button" onClick={() => handleClick(item, custom)}>
        <Tag tag={item.display.toUpperCase()} />
      </button>
    </div>
  );

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && search.results && !search.noResults) {
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
      search.search.display
    ) {
      return (
        <div data-testid="suggestions" className="search">
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
      <p data-testid="no-result" className="no-result__text">
        No results found for {search?.search?.display}.
      </p>
    </div>
  );

  const handleClose = () => {
    setQueryKey('');
    setSearchData({
      ...search,
      noResults: false,
      tags: [],
      users: [],
      results: [],
      search: { display: '', query: '' },
    });
    setNoResults(false);
  };

  return (
    <div className="search-container">
      <SearchBox
        inputHandler={handleInput}
        inputValue={search.search.display.toUpperCase()}
        closeHandler={handleClose}
        enterHandler={handleEnter}
      />
      <Section
        dataTestId="search"
        refresh={getSearchSuggestions}
        isLoading={isLoading}
        shouldRefresh={search.hasError}
      >
        {search.noResults && renderNoResults()}
        {!search.noResults && renderResults()}
      </Section>
    </div>
  );
}
