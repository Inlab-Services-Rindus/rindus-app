import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Tab from '@/ui/components/molecules/section/Section';
import { StoreContext } from '@/ui/context/store/Store';
import '@/ui/section/home/partners-tab/PartnersTab.scss';

export function PartnersTab() {
  const {
    partners: { data, isLoading, hasError },
    getPartners,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  console.log('Pedro ===> isLoading', isLoading);

  useEffect(() => {
    getPartners();
  }, []);

  return (
    <Tab
      isLoading={isLoading}
      className="partners-tab__container"
      dataTestId="partners-tab"
      refresh={getPartners}
      shouldRefresh={hasError}
    >
      {data?.map((partner, index) => (
        <div
          className="partner-card"
          key={index}
          onClick={() => navigate(`/partner/${partner.id}`)}
        >
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
