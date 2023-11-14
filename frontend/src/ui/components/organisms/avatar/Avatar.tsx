import cake from '@/assets/icons/Cake_24.svg';
import captain from '@/assets/icons/Capitan_24.svg';
import '@/ui/components/organisms/avatar/Avatar.scss';

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
  }

  return (
    <div className="avatar">
      <div className={`avatar__picture avatar__picture--${size}`}>
        <img
          loading="lazy"
          className="avatar__picture__img"
          src={profilePictureUrl}
          alt={`${firstName}'s profile picture`}
        />
      </div>
      {renderBadge()}
    </div>
  );
}
