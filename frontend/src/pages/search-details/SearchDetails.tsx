import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import SearchBox from '@/atoms/search-box/SearchBox';
import Tag from '@/atoms/tag/Tag';
import { config } from '@/config/config';
import type { UserItem } from '@/model/Result';
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

  return (
    <>
      <div className="search-container">
        <SearchBox inputValue={query} />
      </div>
      <Tag tagLabel="Results for:" tag={query} />
      {search?.map((user: UserItem) => (
        <UserCard
          key={user.id}
          profilePictureUrl={user.profilePictureUrl}
          firstName={user.firstName}
          lastName={user.lastName}
          position={user.position}
        />
      ))}
    </>
  );
}
