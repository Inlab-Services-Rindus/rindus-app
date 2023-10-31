import { Partner } from '@/model/Partner';
import Tab from '@/molecules/tab/Tab';
import '@/organisms/partners-tab/PartnersTab.scss';

interface PartnersTabProps {
  partners?: Partner[];
  isPartnersLoading: boolean;
}

export function PartnersTab({ partners, isPartnersLoading }: PartnersTabProps) {
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
