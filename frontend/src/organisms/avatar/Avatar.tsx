import { BirthdayCake } from '@/atoms/badges/BirthdayCake';
import { CaptainHat } from '@/atoms/badges/CaptainHat';
import '@/organisms/avatar/Avatar.scss';

export type AvatarSize = 'small' | 'medium' | 'large';
interface AvatarProps {
  profilePictureUrl: string;
  firstName?: string;
  isBirthday?: boolean;
  isCaptain?: boolean;
  size?: AvatarSize;
}

export function Avatar({
  firstName,
  isBirthday,
  isCaptain,
  profilePictureUrl,
  size = 'medium',
}: AvatarProps): JSX.Element {
  function renderBadge() {
    if (isBirthday) {
      return (
        <div className="avatar-picture__badge">
          <BirthdayCake />
        </div>
      );
    }

    if (isCaptain) {
      return (
        <div className="avatar-picture__badge">
          <CaptainHat />
        </div>
      );
    }
  }

  return (
    <div className={`avatar-picture avatar-picture--${size}`}>
      <img
        loading="lazy"
        className={'avatar-picture__img'}
        src={profilePictureUrl}
        alt={`${firstName}'s profile`}
      />
      {renderBadge()}
    </div>
  );
}
