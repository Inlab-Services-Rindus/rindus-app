import { Avatar } from '@/ui/components/organisms/avatar/Avatar';

import '@/ui/components/organisms/avatar-tile/AvatarTile.scss';

interface AvatarTileProps {
  firstName?: string;
  isBirthday?: boolean;
  isCaptain?: boolean;
  profilePictureUrl: string;
  isInViewport?: boolean;
  onClick?: () => void;
}

export default function AvatarTile({
  firstName,
  isBirthday,
  isCaptain,
  profilePictureUrl,
  onClick,
  isInViewport = false,
}: AvatarTileProps): JSX.Element {
  return (
    <div onClick={onClick} className="avatar-tile">
      <div className="avatar__container">
        <Avatar
          size="large"
          profilePictureUrl={profilePictureUrl}
          isBirthday={isBirthday}
          isCaptain={isCaptain}
          isInViewport={isInViewport}
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
