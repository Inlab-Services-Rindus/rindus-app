import { useNavigate } from 'react-router-dom';

import { Avatar, AvatarSize } from '@/organisms/avatar/Avatar';
import '@/organisms/user-card/UserCard.scss';

interface UserCardProps {
  id: number;
  firstName: string;
  lastName?: string;
  isBirthday?: boolean;
  isCaptain?: boolean;
  profilePictureUrl: string;
  position: string;
  handleClick?: (query: string) => void;
  size?: AvatarSize;
}

export default function UserCard({
  id,
  firstName,
  lastName,
  isBirthday,
  isCaptain,
  profilePictureUrl,
  position,
  size,
}: UserCardProps): JSX.Element {
  const fullName = `${firstName}${lastName ? ` ${lastName}` : ''}`;

  const navigate = useNavigate();

  const handleClickCard = () => {
    navigate(`/profile/${id}`);
  };

  return (
    <div onClick={handleClickCard} className="user-card">
      <div className="user-card__img">
        <Avatar
          profilePictureUrl={profilePictureUrl}
          isBirthday={isBirthday}
          isCaptain={isCaptain}
          size={size}
        />
      </div>
      <div className="user-card__info">
        <span className="user-card__info-name">{fullName}</span>
        <span className="user-card__info-position">{position}</span>
      </div>
    </div>
  );
}
