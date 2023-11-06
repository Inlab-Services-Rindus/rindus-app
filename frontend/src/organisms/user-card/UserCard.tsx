import { Avatar, AvatarSize } from '@/organisms/avatar/Avatar';
import '@/organisms/user-card/UserCard.scss';

interface UserCardProps {
  fullName: string;
  isBirthday?: boolean;
  isCaptain?: boolean;
  profilePictureUrl: string;
  position: string;
  handleClick: (query: string) => void;
  size?: AvatarSize;
}

export default function UserCard({
  fullName,
  isBirthday,
  isCaptain,
  profilePictureUrl,
  position,
  handleClick,
  size,
}: UserCardProps): JSX.Element {
  return (
    <div onClick={() => handleClick(fullName)} className="user-card">
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
