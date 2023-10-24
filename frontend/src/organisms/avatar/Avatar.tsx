import { BirthdayCake } from '@/atoms/badges/BirthdayCake';
import { CaptainHat } from '@/atoms/badges/CaptainHat';
import '@/organisms/avatar/Avatar.scss';

interface AvatarProps {
  profilePictureUrl: string;
  firstName: string;
  isBirthday?: boolean;
  isCaptain?: boolean;
}

export function Avatar({
  firstName,
  isBirthday,
  isCaptain,
  profilePictureUrl,
}: AvatarProps): JSX.Element {
  function renderBadge() {
    if (isBirthday) {
      return (
        <div className="avatar__badge">
          <BirthdayCake />
        </div>
      );
    }

    if (isCaptain) {
      return (
        <div className="avatar__badge">
          <CaptainHat />
        </div>
      );
    }
  }

  return (
    <div className="avatar">
      <img
        className="avatar__img"
        src={profilePictureUrl}
        alt={`${firstName}'s profile`}
      />
      {renderBadge()}
    </div>
  );
}
