import { useState } from 'react';

import SearchBox from '@/atoms/search-box/SearchBox';
import { config } from '@/config/config';
import useFetch from '@/hooks/fetch/useFetch';
import useToast from '@/hooks/toast/useToast';
import { Result } from '@/model/Result';
import SearchResults from '@/organisms/search-results/SearchResults';

import { useDebounce } from 'use-debounce';

export function Search() {
  const [query, setQuery] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [debouncedQuery] = useDebounce(query, 400);

  const { showToastError } = useToast();

  const { data: people } = useFetch<Result[]>({
    onErrorCallback: () => {
      showToastError('An error occurred while processing your request.');
    },
    options: {
      // headers: {
      //   'X-Mock-Birthdays': 'true',
      // },
      credentials: 'include',
    },
    url: `${config.backendUrl}/search?query=${query}`,
    deps: debouncedQuery,
  });

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    setQuery(newValue);
  };

  return (
    <>
      <SearchBox inputHandler={handleInput} inputValue={inputValue} />
      <SearchResults results={people} />
    </>
  );
}
