import { Employee } from '@/model/Employee';

interface PeopleTabProps {
  people: Employee[];
}

export function PeopleTab({ people }: PeopleTabProps) {
  return (
    <section data-testid="people-tab">
      <h1>PeopleTab</h1>
      <div>
        {people?.map(
          (employee) =>
            `${employee.first_name} ${employee.last_name} -  ${employee.email}`,
        )}
      </div>
    </section>
  );
}
