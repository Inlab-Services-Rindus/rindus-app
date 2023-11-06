import { useContext, useEffect } from 'react';

import { StoreContext } from '@/context/store/Store';
import Tab from '@/molecules/tab/Tab';
import '@/organisms/partners-tab/PartnersTab.scss';

export function PartnersTab() {
  const {
    partners: { data, isLoading },
    getPartners,
  } = useContext(StoreContext);

  useEffect(() => {
    getPartners();
  }, []);

  return (
    <Tab
      isLoading={isLoading}
      className="partners-tab__container"
      dataTestId="partners-tab"
    >
      {data?.map((partner, index) => (
        <div className="partner-card" key={index}>
          <img
            className="partner-image"
            src={partner.logoUrl}
            loading="lazy"
          ></img>
        </div>
      ))}
    </Tab>
  );
}
