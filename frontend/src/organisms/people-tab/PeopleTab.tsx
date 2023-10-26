import { config } from '@/config/config';
import { Employee } from '@/model/Employee';
import Tab from '@/molecules/tab/Tab';
import '@/organisms/people-tab/PeopleTab.scss';
import UserCard from '@/organisms/user-card/UserCard';

interface PeopleTabProps {
  people?: Employee[];
  isPeopleLoading: boolean;
  refreshPeople: () => void;
}

export function PeopleTab({
  people,
  isPeopleLoading,
  refreshPeople,
}: PeopleTabProps) {
  function handleClick() {
    console.log('clicked');
  }

  return (
    <Tab
      isLoading={isPeopleLoading}
      className="people-tab__container"
      dataTestId="people-tab"
      refresh={refreshPeople}
      shouldRefresh={!isPeopleLoading && !people?.length}
    >
      {people?.map((employee, index) => (
        <UserCard
          onClick={handleClick}
          key={index}
          profilePictureUrl={`${config.backendUrl}${employee.profilePictureUrl}`}
          firstName={employee.firstName}
          lastName={employee.lastName}
          isBirthday={employee.isBirthday}
        />
      ))}
    </Tab>
  );
}
