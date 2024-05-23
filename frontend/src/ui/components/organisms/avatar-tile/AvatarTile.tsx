import { Avatar } from '@/ui/components/organisms/avatar/Avatar';

import '@/ui/components/organisms/avatar-tile/AvatarTile.scss';

interface AvatarTileProps {
  firstName?: string;
  lastName?: string;
  isBirthday?: boolean;
  isCaptain?: boolean;
  profilePictureUrl: string;
  onClick?: () => void;
}

export default function AvatarTile({
  firstName,
  lastName,
  isBirthday,
  isCaptain,
  profilePictureUrl,
  onClick,
}: AvatarTileProps): JSX.Element {
  const getFirstLastName = (lastName: string) => {
    if (!lastName) return '';

    const lastNameParts = lastName.split(' ');

    if (lastNameParts.length === 1) {
      return lastNameParts[0];
    } else if (lastNameParts[0].toLowerCase() === 'de') {
      if (lastNameParts[1].toLowerCase() === 'la' && lastNameParts.length > 2) {
        return `${lastNameParts[0]} ${lastNameParts[1]} ${lastNameParts[2]}`;
      } else if (lastNameParts.length > 1) {
        return `${lastNameParts[0]} ${lastNameParts[1]}`;
      } else {
        return lastNameParts[0];
      }
    } else {
      return lastNameParts[0];
    }
  };

  const firstLastName = getFirstLastName(lastName || '');
  return (
    <div onClick={onClick} className="avatar-tile">
      <div className="avatar__container">
        <Avatar
          size="large"
          profilePictureUrl={profilePictureUrl}
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
          <br />
          <span> {firstLastName}</span>
        </div>
      )}
    </div>
  );
}
