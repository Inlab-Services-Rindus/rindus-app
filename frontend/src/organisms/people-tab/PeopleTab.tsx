import { config } from '@/config/config';
import { Employee } from '@/model/Employee';
import '@/organisms/people-tab/PeopleTab.scss';
import UserCard from '@/organisms/user-card/UserCard';

interface PeopleTabProps {
  people: Employee[];
}

export function PeopleTab({ people }: PeopleTabProps) {
  function handleClick() {
    console.log('clicked');
  }

  return (
    <section data-testid="people-tab">
      <h1>PeopleTab</h1>
      <div className="people-tab__container">
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
      </div>
    </section>
  );
}
