import { Employee } from '@/model/Employee';
import Tab from '@/molecules/tab/Tab';
import AvatarTile from '@/organisms/avatar-tile/AvatarTile';
import '@/organisms/people-tab/PeopleTab.scss';

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
        <AvatarTile
          onClick={handleClick}
          key={index}
          profilePictureUrl={employee.profilePictureUrl}
          firstName={employee.firstName}
          isBirthday={employee.isBirthday}
        />
      ))}
    </Tab>
  );
}
