import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Section from '@/ui/components/molecules/section/Section';
import UserCard from '@/ui/components/organisms/user-card/UserCard';

import { getPartnerInfo } from '@/modules/partners/application/get-info/getPartnerInfo';
import { getPartnerUsers } from '@/modules/partners/application/get-users/getPartnerUsers';
import { Partner as PartnerInfo } from '@/modules/partners/domain/Partner';
import { PartnerUsers } from '@/modules/partners/domain/PartnerUsers';
import { createPartnerRepository } from '@/modules/partners/infrastructure/PartnerRepository';

import '@/ui/section/partner/Partner.scss';

interface Partner {
  info: PartnerInfo;
  employees: PartnerUsers;
}

export function Partner() {
  const { id } = useParams();

  const [partner, setPartner] = useState<Partner>();
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const partnerRepository = createPartnerRepository();

  const load = async (id?: string) => {
    const partnerId = Number(id);
    if (partnerId) {
      setHasError(false);
      try {
        const [info, employees] = await Promise.all([
          getPartnerInfo(partnerRepository, partnerId),
          getPartnerUsers(partnerRepository, partnerId),
        ]);
        setPartner({ info, employees });
      } catch (error) {
        setHasError(true);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load(id);
  }, [id]);

  return (
    <Section
      dataTestId="partner"
      refresh={() => load(id)}
      isLoading={isLoading}
      shouldRefresh={hasError}
    >
      <div className="partner">
        <div className="partner__header">
          <div className="header__info">
            <div className="header__image">
              <img
                src={partner?.info?.logoUrl}
                alt={`${partner?.info?.name} logo`}
              />
            </div>
            <div className="header__title">
              <h1>{partner?.info?.name}</h1>
              <h2>{partner?.info?.description}</h2>
            </div>
          </div>
        </div>
        <div className="partner__body">
          <div className="body__title">
            <h3>Members:</h3>
          </div>
          <div className="body__employees">
            {partner?.employees?.members?.map((employee) => (
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
            {partner?.employees?.captains?.map((captain) => (
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
