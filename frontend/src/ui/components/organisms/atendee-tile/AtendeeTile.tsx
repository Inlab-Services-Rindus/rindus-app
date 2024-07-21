import { useNavigate } from 'react-router-dom';

import { Avatar } from '@/ui/components/organisms/avatar/Avatar';

import { EmployeeEventAttendee } from '@/modules/events/domain/AttendeesEvent';

import '@/ui/components/organisms/atendee-tile/AttendeeTile.scss';

export default function AtendeeTile({
  id,
  profilePictureUrl,
  firstName,
}: EmployeeEventAttendee): JSX.Element {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        navigate(`/profile/${id}`);
      }}
      className="attendees-tile"
    >
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
