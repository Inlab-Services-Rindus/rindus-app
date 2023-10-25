import { config } from '@/config/config';
import useToast from '@/hooks/toast/useToast';
import { Employee } from '@/model/Employee';
import '@/organisms/people-tab/PeopleTab.scss';
import Retry from '@/organisms/retry/Retry';
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

  if (isPeopleLoading) {
    return <Retry refresh={refreshPeople} />;
  }

  return (
    <section data-testid="people-tab" className="people-tab__container">
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
    </section>
  );
}
