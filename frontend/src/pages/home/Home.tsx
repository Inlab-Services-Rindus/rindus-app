import Loader from '@/atoms/loader/Loader';
import { config } from '@/config/config';
import useFetch from '@/hooks/fetch/useFetch';
import useToast from '@/hooks/toast/useToast';
import { Employee } from '@/model/Employee';
import { PeopleTab } from '@/organisms/people-tab/PeopleTab';
import Retry from '@/organisms/retry/Retry';

export function Home() {
  const { showToastError } = useToast();

  const { data, isLoading, refresh } = useFetch<Employee[]>({
    onErrorCallback: () => {
      showToastError('An error occurred while processing your request.');
    },
    options: {
      credentials: 'include',
    },
    url: `${config.backendUrl}/users`,
  });

  if (isLoading) {
    return (
      <div className="loader__container">
        <Loader />
      </div>
    );
  }

  return (
    <div className="homePage">
      {data ? <PeopleTab people={data} /> : <Retry refresh={refresh} />}
    </div>
  );
}
