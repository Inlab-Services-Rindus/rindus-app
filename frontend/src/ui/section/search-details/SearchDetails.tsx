import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { config } from '@/config/config';
import { UserExtended } from '@/modules/users/domain/User';
import SearchBox from '@/ui/components/atoms/search-box/SearchBox';
import Tag from '@/ui/components/atoms/tag/Tag';
import UserCard from '@/ui/components/organisms/user-card/UserCard';
import '@/ui/section/search-details/SearchDetails.scss';

export function SearchDetails(): JSX.Element {
  const [search, setSearch] = useState<UserExtended[]>([]);
  const [query, setQuery] = useState<string>('Search');
  const params = useParams();

  useEffect(() => {
    fetch(encodeURI(`${config.backendUrl}/search?query=${params.query}`), {
      credentials: 'include',
    })
      .then((response) => response.json() as Promise<UserExtended[]>)
      .then(setSearch);

    if (params.query) {
      setQuery(params.query);
    }
  }, []);

  return (
    <div className="result__container">
      <div className="box__container">
        <SearchBox inputValue={query} />
      </div>
      <div className="result__tag">
        <div>
          <span className="result__tag__text">Results for: </span>
        </div>
        <div>
          <Tag tag={query.toUpperCase()} />
        </div>
      </div>
      {search?.map((user: UserExtended) => (
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
