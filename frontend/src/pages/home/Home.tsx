import { TabPanel } from '@/molecules/tabPanel/TabPanel';
import { PartnersTab } from '@/organisms/partners-tab/PartnersTab';
import { PeopleTab } from '@/organisms/people-tab/PeopleTab';

export function Home() {
  const tabs = [
    {
      label: 'People',
      content: <PeopleTab />,
    },
    {
      label: 'Partners',
      content: <PartnersTab />,
    },
  ];

  return (
    <div className="homePage">
      <TabPanel tabs={tabs} />
    </div>
  );
}
