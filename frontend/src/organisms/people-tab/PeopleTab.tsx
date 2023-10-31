import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { config } from '@/config/config';
import { Employee } from '@/model/Employee';
import Tab from '@/molecules/tab/Tab';
import AvatarTile from '@/organisms/avatar-tile/AvatarTile';
import '@/organisms/people-tab/PeopleTab.scss';

interface PaginatedEmployees {
  users: Employee[];
  totalPages: number;
}

export function PeopleTab() {
  const [people, setPeople] = useState<Employee[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isPeopleLoading, setIsPeopleLoading] = useState(true);

  useEffect(() => {
    fetchPage(1);
  }, []);

  function handleClick() {
    console.log('clicked');
  }

  function fetchData() {
    const nextPage = page + 1;
    fetchPage(nextPage);
    setPage(nextPage);
  }

  function fetchPage(page: number) {
    fetch(`${config.backendUrl}/users?page=${page}`, { credentials: 'include' })
      .then((response) => response.json() as Promise<PaginatedEmployees>)
      .then((pagination) => {
        setPeople([...people, ...pagination.users]);
        if (page === 1) {
          setTotalPages(pagination.totalPages);
        }
        setIsPeopleLoading(false);
      });
  }

  function hasMore() {
    return page < totalPages;
  }

  return (
    <Tab
      isLoading={isPeopleLoading}
      dataTestId="people-tab"
      refresh={() => {}}
      shouldRefresh={!isPeopleLoading && !people.length}
    >
      <InfiniteScroll
        className="people-tab__container"
        dataLength={people.length}
        next={fetchData}
        hasMore={hasMore()}
        loader={<h4>Loading...</h4>}
      >
        {people?.map((employee, index) => (
          <AvatarTile
            onClick={handleClick}
            key={index}
            profilePictureUrl={employee.profilePictureUrl}
            firstName={employee.firstName}
            isBirthday={employee.isBirthday}
          />
        ))}
      </InfiniteScroll>
    </Tab>
  );
}
