import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Section from '@/ui/components/molecules/section/Section';
import UserCard from '@/ui/components/organisms/user-card/UserCard';

import { getPartnerInfo } from '@/modules/partners/application/get-info/getPartnerInfo';
import { getPartnerUsers } from '@/modules/partners/application/get-users/getPartnerUsers';
import { Partner } from '@/modules/partners/domain/Partner';
import { createPartnerRepository } from '@/modules/partners/infrastructure/PartnerRepository';
import { UserExtended } from '@/modules/users/domain/User';

import '@/ui/section/partner/Partner.scss';

export function PartnerInfo() {
  const { id } = useParams();

  const [partnerInfo, setPartnerInfo] = useState<Partner>();
  const [members, setMembers] = useState<UserExtended[]>([]);
  const [captains, setCaptains] = useState<UserExtended[]>([]);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const partnerRepository = createPartnerRepository();

  const load = async (partnerId?: string) => {
    if (partnerId) {
      setHasError(false);
      try {
        const partnerInfo = await getPartnerInfo(partnerRepository, partnerId);
        setPartnerInfo(partnerInfo);

        const users = await getPartnerUsers(partnerRepository, partnerId);
        setMembers(users.members);
        setCaptains(users.captains);
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
                src={partnerInfo?.logoUrl}
                alt={`${partnerInfo?.name} logo`}
                loading="lazy"
              />
            </div>
            <div className="header__title">
              <h1>{partnerInfo?.name}</h1>
              <h2>{partnerInfo?.description}</h2>
            </div>
          </div>
        </div>
        <div className="partner__body">
          <div className="body__title">
            <h3>Team:</h3>
          </div>
          <div className="body__employees">
            {members?.map((employee) => (
              <UserCard
                key={employee.id}
                id={employee.id}
                profilePictureUrl={employee.profilePictureUrl}
                firstName={employee.firstName}
                lastName={employee.lastName}
                position={employee.position}
              />
            ))}
          </div>
          <div className="body__captains">
            {captains?.map((captain) => (
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
