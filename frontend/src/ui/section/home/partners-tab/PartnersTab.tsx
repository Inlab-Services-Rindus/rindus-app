import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Section from '@/ui/components/molecules/section/Section';

import { StoreContext } from '@/ui/context/store/Store';

import '@/ui/section/home/partners-tab/PartnersTab.scss';

export default function PartnersTab() {
  const {
    partners: { data, isLoading, hasError},
    getPartners,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  useEffect(() => {
    getPartners();
  }, []);

  return (
    <Section
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
          <img className="partner-image" src={partner.logoUrl}></img>
        </div>
      ))}
    </Section>
  );
}
