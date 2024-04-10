import cake from '@/assets/icons/Cake_24.svg';
import captain from '@/assets/icons/Capitan_24.svg';
import check from '@/assets/icons/Check.svg';

import '@/ui/components/organisms/avatar/Avatar.scss';

export type AvatarSize = 'small' | 'medium' | 'large';
interface AvatarProps {
  profilePictureUrl: string;
  isBirthday?: boolean;
  isCaptain?: boolean;
  size?: AvatarSize;
  isAttendance?: boolean;
}

export function Avatar({
  isBirthday,
  isCaptain,
  profilePictureUrl,
  size = 'medium',
  isAttendance,
}: AvatarProps): JSX.Element {
  function renderBadge() {
    if (isBirthday) {
      return (
        <div
          className={`avatar__badge avatar__badge--cake avatar__badge--${size}`}
        >
          <img src={cake} alt="cake" />
        </div>
      );
    }

    if (isCaptain) {
      return (
        <div
          className={`avatar__badge avatar__badge--captain avatar__badge--${size}`}
        >
          <img src={captain} alt="captain" />
        </div>
      );
    }
    if (isAttendance) {
      return (
        <div
          className={`avatar__badge avatar__badge--check avatar__badge--${size}`}
        >
          <img src={check} alt="check" />
        </div>
      );
    }
  }

  return (
    <div className="avatar">
      <div className={`avatar__picture avatar__picture--${size}`}>
        <img
          loading="lazy"
          className="avatar__picture__img"
          src={profilePictureUrl}
          alt={'Profile picture'}
        />
      </div>
      {renderBadge()}
    </div>
  );
}
