import { useContext, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';

import { StoreContext } from '@/context/store/Store';
import Tab from '@/molecules/tab/Tab';
import AvatarTile from '@/organisms/avatar-tile/AvatarTile';
import '@/organisms/people-tab/PeopleTab.scss';

export function PeopleTab() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    employees: { data, hasMore },
    getEmployees,
  } = useContext(StoreContext);

  const actionGetEmployees = async (first?: boolean) => {
    setIsLoading(true);
    await getEmployees(first);
    setIsLoading(false);
  };

  useEffect(() => {
    actionGetEmployees(true);
  }, []);

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
        next={actionGetEmployees}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        {data?.map((employee, index) => (
          <AvatarTile
            onClick={() => {
              navigate(`/profile/${employee.id}/`);
            }}
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
