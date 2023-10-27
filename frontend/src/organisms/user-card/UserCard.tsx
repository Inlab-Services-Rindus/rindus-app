import { Avatar } from '@/organisms/avatar/Avatar';
import '@/organisms/user-card/UserCard.scss';

interface UserCardProps {
  fullName: string;
  isBirthday?: boolean;
  isCaptain?: boolean;
  profilePictureUrl: string;
  position: string;
  onClick?: () => void;
}

export default function UserCard({
  fullName,
  isBirthday,
  isCaptain,
  profilePictureUrl,
  position,
  onClick,
}: UserCardProps): JSX.Element {
  return (
    <div onClick={onClick} className="user-card">
      <div className="user-card__img">
        <Avatar
          profilePictureUrl={profilePictureUrl}
          isBirthday={isBirthday}
          isCaptain={isCaptain}
          className="user-card"
        />
      </div>
      <div className="user-card__info">
        <span className="user-card__info-name">{fullName}</span>
        <span className="user-card__info-position">{position}</span>
      </div>
    </div>
  );
}
