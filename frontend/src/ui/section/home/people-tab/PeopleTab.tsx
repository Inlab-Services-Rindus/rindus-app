import { useContext, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';

import Loader from '@/ui/components/atoms/loader/Loader';
import Section from '@/ui/components/molecules/section/Section';
import AvatarTile from '@/ui/components/organisms/avatar-tile/AvatarTile';
import { StoreContext } from '@/ui/context/store/Store';
import '@/ui/section/home/people-tab/PeopleTab.scss';

export function PeopleTab() {
  const navigate = useNavigate();
  const {
    users: { data, hasMore, hasError },
    getUsers,
  } = useContext(StoreContext);

  const actionGetEmployees = async (first?: boolean) => {
    await getUsers(first);
  };

  useEffect(() => {
    actionGetEmployees(true);
  }, []);

  return (
    <Section
      dataTestId="people-tab"
      refresh={() => actionGetEmployees(true)}
      shouldRefresh={hasError}
    >
      <InfiniteScroll
        className="people-tab__container"
        dataLength={data.length}
        next={actionGetEmployees}
        hasMore={hasMore}
        loader={
          <div className="people-tab__loader">
            <Loader />
          </div>
        }
      >
        {data?.map((employee, index) => (
          <AvatarTile
            onClick={() => {
              navigate(`/profile/${employee.id}`);
            }}
            key={index}
            profilePictureUrl={employee.profilePictureUrl}
            firstName={employee.firstName}
            isBirthday={employee.isBirthday}
          />
        ))}
      </InfiniteScroll>
    </Section>
  );
}
