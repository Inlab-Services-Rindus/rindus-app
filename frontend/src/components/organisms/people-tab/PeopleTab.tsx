import { Employee } from '@/model/Employee';

import { config } from '@/config/config';

interface PeopleTabProps {
  people: Employee[];
}

export function PeopleTab({ people }: PeopleTabProps) {
  return (
    <section data-testid="people-tab">
      <h1>PeopleTab</h1>
      <div>
        <ul>
          {people?.map((employee, index) => (
            <li key={index}>
              <ul><img src={`${config.backendUrl}${employee.profilePictureUrl}`} style={{height: '50px', width: '50px'}}></img>
              <span>{` ${employee.firstName} ${employee.lastName} - ${employee.email}`}</span></ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
