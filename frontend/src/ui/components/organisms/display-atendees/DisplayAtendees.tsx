import { Avatar } from '@/ui/components/organisms/avatar/Avatar';

import '@/ui/components/organisms/avatar-tile/AvatarTile.scss';

interface DisplayAttendeesProps {
  isAttendance?: boolean;
  profilePictureUrl: string;
  firstName?: string;
}

export default function DisplayAttendees({
  isAttendance,
  profilePictureUrl,
  firstName,
}: DisplayAttendeesProps): JSX.Element {
  return (
    <div className="display-attendees">
      <div className="avatar__container">
        <Avatar
          size="large"
          profilePictureUrl={profilePictureUrl}
          isAttendance={isAttendance}
        />
      </div>
      <div>{firstName}</div>
    </div>
  );
}
