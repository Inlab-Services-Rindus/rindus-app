import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import SearchBox from '@/atoms/search-box/SearchBox';
import Tag from '@/atoms/tag/Tag';
import { config } from '@/config/config';
import { UserItem } from '@/model/Result';
import UserCard from '@/organisms/user-card/UserCard';
import '@/pages/search-details/SearchDetails.scss';

export function SearchDetails(): JSX.Element {
  const [search, setSearch] = useState<UserItem[]>([]);
  const [query, setQuery] = useState<string>('Search');
  const params = useParams();

  useEffect(() => {
    fetch(encodeURI(`${config.backendUrl}/search?query=${params.query}`), {
      credentials: 'include',
    })
      .then((response) => response.json() as Promise<UserItem[]>)
      .then(setSearch);

    if (params.query) {
      setQuery(params.query);
    }
  }, []);

  const handleInput = () => {
    console.log('value');
  };

  return (
    <>
      <div className="search-container">
        <SearchBox inputHandler={handleInput} inputValue={query} />
      </div>
      <Tag
        tagLabel="Results for:"
        handleClick={() => console.log('hola')}
        tag={query}
      />
      {search?.map((user: UserItem) => (
        <UserCard
          handleClick={() => console.log('hola')}
          key={user.id}
          profilePictureUrl={user.profilePictureUrl}
          fullName={user.fullName}
          position={user.position}
        />
      ))}
    </>
  );
}
