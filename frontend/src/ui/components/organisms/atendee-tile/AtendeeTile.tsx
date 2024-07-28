import { useNavigate } from 'react-router-dom';

import { Avatar } from '@/ui/components/organisms/avatar/Avatar';

import '@/ui/components/organisms/atendee-tile/AttendeeTile.scss';

interface AtendeeTileProps {
  id?: number;
  profilePictureUrl: string;
  firstName: string;
  badgeNumber?: number;
}

export default function AtendeeTile({
  id,
  profilePictureUrl,
  firstName,
  badgeNumber,
}: AtendeeTileProps): JSX.Element {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        id && navigate(`/profile/${id}`);
      }}
      className="attendees-tile"
    >
      <div className="attendees__container">
        <Avatar
          size="medium"
          profilePictureUrl={profilePictureUrl}
          isAttendee
          badgeNumber={badgeNumber}
        />
      </div>
      <div>{firstName}</div>
    </div>
  );
}
