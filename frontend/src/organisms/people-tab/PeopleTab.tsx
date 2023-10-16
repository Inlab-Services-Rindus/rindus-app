import { Employee } from '@/model/Employee';

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
              {`${employee.firstName} ${employee.lastName} - ${employee.email}`}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
