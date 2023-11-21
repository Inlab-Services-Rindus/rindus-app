import { TabPanel } from '@/ui/components/molecules/tabPanel/TabPanel';
import PartnersTab from '@/ui/section/home/partners-tab/PartnersTab';
import PeopleTab from '@/ui/section/home/people-tab/PeopleTab';

import '@/ui/section/home/Home.scss';

export function Home() {
  const tabs = [
    {
      label: 'People',
      content: <PeopleTab />,
    },
    {
      label: 'Departments',
      content: <PartnersTab />,
    },
  ];

  return (
    <div className="home">
      <TabPanel tabs={tabs} />
    </div>
  );
}
