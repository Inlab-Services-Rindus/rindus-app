import { Avatar } from '@/organisms/avatar/Avatar';
import '@/organisms/user-card/UserCard.scss';

interface UserCardProps {
  firstName: string;
  lastName: string;
  isBirthday?: boolean;
  isCaptain?: boolean;
  profilePictureUrl: string;
  onClick: () => void;
}

export default function UserCard({
  firstName,
  isBirthday,
  isCaptain,
  lastName,
  profilePictureUrl,
  onClick,
}: UserCardProps): JSX.Element {
  return (
    <div onClick={onClick} className="user-card">
      <div className="user-card__img">
        <Avatar
          profilePictureUrl={profilePictureUrl}
          firstName={firstName}
          isBirthday={isBirthday}
          isCaptain={isCaptain}
          className="user-card"
        />
      </div>
      <div className="user-card__info">
        <span className="user-card__info-name">
          {firstName}
          {lastName}
        </span>
        <span className="user-card__info-position">Position</span>
      </div>
    </div>
  );
}
