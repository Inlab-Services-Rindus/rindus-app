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
      <ul>
        {partners?.map((partner, index) => (
          <li key={index}>
            <ul>
              <img
                src={partner.logoUrl}
                style={{ height: '50px', width: '50px' }}
              ></img>
              <span>{` ${partner.name}`}</span>
            </ul>
          </li>
        ))}
      </ul>
    </Tab>
  );
}
