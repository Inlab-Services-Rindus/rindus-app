import { config } from '@/config/config';
import useFetch from '@/hooks/fetch/useFetch';
import { Partner } from '@/model/Partner';
import Tab from '@/molecules/tab/Tab';
import '@/organisms/partners-tab/PartnersTab.scss';

export function PartnersTab() {
  const { data: partners, isLoading: isPartnersLoading } = useFetch<Partner[]>({
    options: {
      credentials: 'include',
    },
    url: `${config.backendUrl}/partners`,
  });

  return (
    <Tab
      isLoading={isPartnersLoading}
      className="partners-tab__container"
      dataTestId="partners-tab"
    >
      {partners?.map((partner, index) => (
        <div className="partner-card" key={index}>
          <img className="partner-image" src={partner.logoUrl}></img>
        </div>
      ))}
    </Tab>
  );
}
