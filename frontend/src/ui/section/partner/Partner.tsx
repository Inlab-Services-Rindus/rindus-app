import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Section from '@/ui/components/molecules/section/Section';
import UserCard from '@/ui/components/organisms/user-card/UserCard';

import { StoreContext } from '@/ui/context/store/Store';

import '@/ui/section/partner/Partner.scss';

export function Partner() {
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);

  const { lastPartner, getLastPartner } = useContext(StoreContext);

  const actionGetPartner = async () => {
    if (id) {
      setIsLoading(true);
      await getLastPartner(Number(id));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    actionGetPartner();
  }, []);

  return (
    <Section
      dataTestId="partner"
      refresh={() => actionGetPartner()}
      isLoading={isLoading}
      shouldRefresh={lastPartner?.hasError}
    >
      <div className="partner">
        <div className="partner__header">
          <div className="header__info">
            <div className="header__image">
              <img
                src={lastPartner?.partnerInfo?.logoUrl}
                alt={`${lastPartner?.partnerInfo?.name} logo`}
                loading="lazy"
              />
            </div>
            <div className="header__title">
              <h1>{lastPartner?.partnerInfo?.name}</h1>
              <h2>{lastPartner?.partnerInfo?.description}</h2>
            </div>
          </div>
        </div>
        <div className="partner__body">
          <div className="body__title">
            <h3>Members:</h3>
          </div>
          <div className="body__employees">
            {lastPartner?.members?.map((employee) => (
              <UserCard
                key={employee.id}
                id={employee.id}
                profilePictureUrl={employee.profilePictureUrl}
                firstName={employee.firstName}
                lastName={employee.lastName}
                position={employee.position}
                isCaptain={employee.isCaptain} // Rindus case
              />
            ))}
          </div>
          <div className="body__captains">
            {lastPartner?.captains?.map((captain) => (
              <UserCard
                key={captain.id}
                id={captain.id}
                profilePictureUrl={captain.profilePictureUrl}
                firstName={captain.firstName}
                lastName={captain.lastName}
                isCaptain={true}
                position={captain.position}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
