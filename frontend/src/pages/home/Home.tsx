import { config } from '@/config/config';
import useFetch from '@/hooks/fetch/useFetch';
import useToast from '@/hooks/toast/useToast';
import { Employee } from '@/model/Employee';
import { Partner } from '@/model/Partner';
import { TabPanel } from '@/molecules/tabPanel/TabPanel';
import { PartnersTab } from '@/organisms/partners-tab/PartnersTab';
import { PeopleTab } from '@/organisms/people-tab/PeopleTab';

export function Home() {
  const { showToastError } = useToast();

  const { data: partners, isLoading: isPartnersLoading } = useFetch<Partner[]>({
    onErrorCallback: () => {
      showToastError('An error occurred while processing your request.');
    },
    options: {
      credentials: 'include',
    },
    url: `${config.backendUrl}/partners`,
  });

  const tabs = [
    {
      label: 'People',
      content: <PeopleTab />,
    },
    {
      label: 'Partners',
      content: (
        <PartnersTab
          partners={partners ?? []}
          isPartnersLoading={isPartnersLoading}
        />
      ),
    },
  ];

  return (
    <div className="homePage">
      <TabPanel tabs={tabs} />
    </div>
  );
}
