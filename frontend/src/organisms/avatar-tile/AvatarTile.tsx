import '@/organisms/avatar-tile/AvatarTile.scss';
import { Avatar } from '@/organisms/avatar/Avatar';

interface AvatarTileProps {
  firstName?: string;
  isBirthday?: boolean;
  isCaptain?: boolean;
  profilePictureUrl: string;
  onClick?: () => void;
}

export default function AvatarTile({
  firstName,
  isBirthday,
  isCaptain,
  profilePictureUrl,
  onClick,
}: AvatarTileProps): JSX.Element {
  return (
    <div onClick={onClick} className="avatar-tile">
      <div>
        <Avatar
          size="large"
          profilePictureUrl={profilePictureUrl}
          firstName={firstName}
          isBirthday={isBirthday}
          isCaptain={isCaptain}
        />
      </div>
      {firstName && (
        <div
          className={`avatar-tile__name ${
            isBirthday ? 'avatar-tile__name--bold' : ''
          }`}
        >
          <span>{firstName}</span>
        </div>
      )}
    </div>
  );
}
