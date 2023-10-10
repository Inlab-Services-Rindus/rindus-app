import { useNavigate } from 'react-router-dom';

import RefreshButton from '@/atoms/buttons/refresh/RefreshButton';
import Message from '@/atoms/message/Message';
import { config } from '@/config/config';
import useFetch from '@/hooks/fetch/useFetch';
import useToast from '@/hooks/toast/useToast';
import { Employee } from '@/model/Employee';
import { Header } from '@/organisms/header/Header';
import { NotificationLayout } from '@/organisms/notificationLayout/NotificationLayout';
import { PeopleTab } from '@/organisms/people-tab/PeopleTab';

export function Home() {
  const navigate = useNavigate();
  const { showToastError, showToastInfo } = useToast();

  const navigateToLogin = async () => {
    // TODO: Problem with coookie in the backend
    // await navigate('/login');
    // showToastInfo('Please login to continue.');
  };

  // TODO: Problem with coookie in the backend
  const { data, refresh } = useFetch<Employee[]>({
    onErrorCallback: () =>
      showToastError('An error occurred while processing your request.'),
    onUnauthorizedCallback: () => navigateToLogin(),
    options: {},
    url: `${config.backendUrl}/users`,
  });

  return (
    <div className="homePage">
      <Header />
      {data ? (
        <PeopleTab people={data} />
      ) : (
        <NotificationLayout>
          <Message message="Oops! Something went wrong. Please click to refresh and try again." />
          <RefreshButton handleRefresh={refresh} />
        </NotificationLayout>
      )}
    </div>
  );
}
