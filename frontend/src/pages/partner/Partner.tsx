import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Loader from '@/atoms/loader/Loader';
import { config } from '@/config/config';
import { EmployeeProfile } from '@/model/Employee';
import { Partner } from '@/model/Partner';
import UserCard from '@/organisms/user-card/UserCard';
import '@/pages/partner/Partner.scss';

interface PartnerMembers {
  members: EmployeeProfile[];
  captains: EmployeeProfile[];
}

export default function PartnerInfo() {
  const { id } = useParams();

  const [partnerInfo, setPartnerInfo] = useState<Partner>();
  const [members, setMembers] = useState<EmployeeProfile[]>([]);
  const [captains, setCaptains] = useState<EmployeeProfile[]>([]);

  useEffect(() => {
    fetch(`${config.backendUrl}/partners/${id}`, {
      credentials: 'include',
    })
      .then((response) => response.json() as Promise<Partner>)
      .then((result) => {
        setPartnerInfo(result);
      });

    fetch(`${config.backendUrl}/partners/${id}/members`, {
      credentials: 'include',
    })
      .then((response) => response.json() as Promise<PartnerMembers>)
      .then((result) => {
        setMembers(result.members);
        setCaptains(result.captains);
      });
  }, [id]);

  if (!partnerInfo || !members || !captains) {
    return <Loader />;
  }

  return (
    <div className="partner">
      <div className="partner__header">
        <div className="header__info">
          <div className="header__image">
            <img
              src={partnerInfo.logoUrl}
              alt={`${partnerInfo.name} logo`}
              loading="lazy"
            />
          </div>
          <div className="header__title">
            <h1>{partnerInfo.name}</h1>
            <h2>{partnerInfo.description}</h2>
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
              handleClick={() => console.log('hola')}
              key={employee.id}
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
              handleClick={() => console.log('hola')}
              key={captain.id}
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
  );
}
