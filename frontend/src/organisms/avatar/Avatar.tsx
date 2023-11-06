import { BirthdayCake } from '@/atoms/badges/BirthdayCake';
import { CaptainHat } from '@/atoms/badges/CaptainHat';
import '@/organisms/avatar/Avatar.scss';

interface AvatarProps {
  profilePictureUrl: string;
  firstName?: string;
  isBirthday?: boolean;
  isCaptain?: boolean;
  className?: string;
}

export function Avatar({
  firstName,
  isBirthday,
  isCaptain,
  profilePictureUrl,
  className = 'avatar',
}: AvatarProps): JSX.Element {
  function renderBadge() {
    if (isBirthday) {
      return (
        <div className={`${className}-picture__badge`}>
          <BirthdayCake />
        </div>
      );
    }

    if (isCaptain) {
      return (
        <div className={`${className}-picture__badge`}>
          <CaptainHat />
        </div>
      );
    }
  }

  return (
    <div className={`${className}-picture`}>
      <img
        loading="lazy"
        className={`${className}-picture__img`}
        src={profilePictureUrl}
        alt={`${firstName}'s profile`}
      />
      {renderBadge()}
    </div>
  );
}
