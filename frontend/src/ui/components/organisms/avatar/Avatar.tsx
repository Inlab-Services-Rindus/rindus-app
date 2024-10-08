import cake from '@/assets/icons/Cake_24.svg';
import captain from '@/assets/icons/Capitan_24.svg';
import ok from '@/assets/icons/Ok_24.svg';

import { BEMClassHelper } from '@/ui/helpers/BEMClassHelper';

import '@/ui/components/organisms/avatar/Avatar.scss';

export type AvatarSize = 'small' | 'medium' | 'large';
interface AvatarProps {
  profilePictureUrl: string;
  isBirthday?: boolean;
  isCaptain?: boolean;
  size?: AvatarSize;
  isAttendee?: boolean;
  isInViewport?: boolean;
  badgeNumber?: number;
}

export function Avatar({
  isBirthday,
  isCaptain,
  profilePictureUrl,
  size = 'medium',
  isAttendee = false,
  isInViewport = false,
  badgeNumber,
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
    if (isAttendee) {
      return (
        <div
          className={`avatar__badge avatar__badge--ok avatar__badge--${size}`}
        >
          {badgeNumber ? (
            <span className="avatar__badge-number">{badgeNumber}</span>
          ) : (
            <img src={ok} alt="ok" />
          )}
        </div>
      );
    }
  }

  return (
    <div className="avatar">
      <div className={`avatar__picture avatar__picture--${size}`}>
        <img
          loading={isInViewport ? 'eager' : 'lazy'}
          className={BEMClassHelper(
            'avatar__picture',
            'img',
            Boolean(badgeNumber) && 'customIcon',
          )}
          src={profilePictureUrl}
          alt={'Profile picture'}
        />
      </div>
      {renderBadge()}
    </div>
  );
}
