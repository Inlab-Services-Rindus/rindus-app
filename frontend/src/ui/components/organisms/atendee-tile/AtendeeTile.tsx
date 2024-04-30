import { Avatar } from '@/ui/components/organisms/avatar/Avatar';

// import '@/ui/components/organisms/display-atendees/DisplayAttendees.scss';

interface DisplayAttendeesProps {
  profilePictureUrl: string;
  firstName?: string;
}

export default function AtendeeTile({
  profilePictureUrl,
  firstName,
}: DisplayAttendeesProps): JSX.Element {
  return (
    <div className="display-attendees">
      <div className="avatar__container">
        <Avatar size="large" profilePictureUrl={profilePictureUrl} isAttendee />
      </div>
      <div>{firstName}</div>
    </div>
  );
}
