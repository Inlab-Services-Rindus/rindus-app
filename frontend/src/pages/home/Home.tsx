import Loader from '@/atoms/loader/Loader';
import { config } from '@/config/config';
import useFetch from '@/hooks/fetch/useFetch';
import useToast from '@/hooks/toast/useToast';
import { Employee } from '@/model/Employee';
import { Partner } from '@/model/Partner';
import { PartnersTab } from '@/organisms/partners-tab/PartnersTab';
import { PeopleTab } from '@/organisms/people-tab/PeopleTab';
import Retry from '@/organisms/retry/Retry';

export function Home() {
  const { showToastError } = useToast();

  const {
    data: people,
    isLoading: isPeopleLoading,
    refresh: refreshPeople,
  } = useFetch<Employee[]>({
    onErrorCallback: () => {
      showToastError('An error occurred while processing your request.');
    },
    options: {
      headers: {
        'X-Mock-Birthdays': 'true',
      },
      credentials: 'include',
    },
    url: `${config.backendUrl}/users`,
  });

  const { data: partners, isLoading: isPartnersLoading } = useFetch<Partner[]>({
    onErrorCallback: () => {
      showToastError('An error occurred while processing your request.');
    },
    options: {
      credentials: 'include',
    },
    url: `${config.backendUrl}/partners`,
  });

  if (isPeopleLoading || isPartnersLoading) {
    return (
      <div className="loader__container">
        <Loader />
      </div>
    );
  }

  return (
    <div className="homePage">
      {people ? (
        <PeopleTab people={people} />
      ) : (
        <Retry refresh={refreshPeople} />
      )}
      {partners && <PartnersTab partners={partners} />}
    </div>
  );
}
