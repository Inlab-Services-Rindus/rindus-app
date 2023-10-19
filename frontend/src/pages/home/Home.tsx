import { Header } from '@/components/organisms/header/Header';
import { PeopleTab } from '@/components/organisms/people-tab/PeopleTab';
import Retry from '@/components/organisms/retry/Retry';
import { config } from '@/config/config';
import useFetch from '@/hooks/fetch/useFetch';
import useToast from '@/hooks/toast/useToast';
import { Employee } from '@/model/Employee';

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
    return <div data-testid="loader">Loading...</div>;
  }

  return (
    <div className="homePage">
      <Header />
      {data ? <PeopleTab people={data} /> : <Retry refresh={refresh} />}
    </div>
  );
}
