import { useContext, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { StoreContext } from '@/context/store/Store';
import Tab from '@/molecules/tab/Tab';
import AvatarTile from '@/organisms/avatar-tile/AvatarTile';
import '@/organisms/people-tab/PeopleTab.scss';

export function PeopleTab() {
  const {
    employees: { data, isLoading, hasMore },
    getEmployees,
  } = useContext(StoreContext);

  useEffect(() => {
    getEmployees(true);
  }, []);

  function handleClick() {
    console.log('clicked');
  }

  return (
    <Tab
      isLoading={isLoading}
      dataTestId="people-tab"
      refresh={() => {}}
      shouldRefresh={!isLoading && !data.length}
    >
      <InfiniteScroll
        className="people-tab__container"
        dataLength={data.length}
        next={getEmployees}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        {data?.map((employee, index) => (
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
