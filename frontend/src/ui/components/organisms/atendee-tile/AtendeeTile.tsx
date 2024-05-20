import { Avatar } from '@/ui/components/organisms/avatar/Avatar';

import '@/ui/components/organisms/atendee-tile/AttendeeTile.scss';

interface DisplayAttendeesProps {
  profilePictureUrl: string;
  firstName?: string;
  onClick?: () => void;
}

export default function AtendeeTile({
  profilePictureUrl,
  firstName,
  onClick,
}: DisplayAttendeesProps): JSX.Element {
  return (
    <div onClick={onClick} className="attendees-tile">
      <div className="attendees__container">
        <Avatar
          size="medium"
          profilePictureUrl={profilePictureUrl}
          isAttendee
        />
      </div>
      <div>{firstName}</div>
    </div>
  );
}
