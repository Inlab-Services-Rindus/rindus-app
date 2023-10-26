import { Avatar } from '@/organisms/avatar/Avatar';
import '@/organisms/user-card/UserCard.scss';

interface UserCardProps {
  firstName: string;
  isBirthday?: boolean;
  isCaptain?: boolean;
  profilePictureUrl: string;
  onClick: () => void;
}

export default function UserCard({
  firstName,
  isBirthday,
  isCaptain,
  profilePictureUrl,
  onClick,
}: UserCardProps): JSX.Element {
  return (
    <div onClick={onClick} className="user-card">
      <div>
        <Avatar
          profilePictureUrl={profilePictureUrl}
          firstName={firstName}
          isBirthday={isBirthday}
          isCaptain={isCaptain}
        />
      </div>
      <div className="user-card__name">
        <span>{firstName}</span>
      </div>
    </div>
  );
}
