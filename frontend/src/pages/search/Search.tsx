import { useState } from 'react';

import SearchBox from '@/atoms/search-box/SearchBox';
import useFetch from '@/hooks/fetch/useFetch';
import useToast from '@/hooks/toast/useToast';
import { Employee } from '@/model/Employee';
import UserCard from '@/organisms/user-card/UserCard';

import { useDebounce } from 'use-debounce';

export function Search() {
  const [query, setQuery] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [debouncedQuery] = useDebounce(query, 400);

  const { showToastError } = useToast();

  const shouldFetchData = !!debouncedQuery;

  const { data: people } = useFetch<Employee[]>({
    onErrorCallback: () => {
      shouldFetchData
        ? showToastError('An error occurred while processing your request.')
        : '';
    },
    url: shouldFetchData
      ? `https://rickandmortyapi.com/api/character/?name=${query}`
      : '',
    deps: debouncedQuery,
  });

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    setQuery(newValue);
  };

  const handleClick = () => {};

  return (
    <>
      <SearchBox
        inputHandler={handleInput}
        inputValue={inputValue}
        clickHandler={handleClick}
      />
      {(people as any)?.results.map(
        (person: { name: string | number | boolean | null | undefined }) => (
          <UserCard
            key={person.name}
            profilePictureUrl={person.image}
            firstName={person.name}
          />
        ),
      )}
    </>
  );
}
