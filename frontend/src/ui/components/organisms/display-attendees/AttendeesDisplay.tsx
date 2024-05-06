import { useContext, useEffect } from 'react';

import '@/mocks/attendees.ts';
import Loader from '@/ui/components/atoms/loader/Loader';
import AtendeeTile from '@/ui/components/organisms/atendee-tile/AtendeeTile';

import { StoreContext } from '@/ui/context/store/Store';

import '@/ui/components/organisms/display-attendees/AttendeesDisplay.scss';

// import '@/ui/section/home/display-attendees/DisplayAttendees.scss';

export default function AttendeesDisplay() {
  const id = 1;
  const {
    attendance: { data, isLoading, hasError },
    getAttendance,
  } = useContext(StoreContext);

  const actionGetAttendance = (id: number) => {
    getAttendance(id);
  };

  useEffect(() => {
    actionGetAttendance(id);
  }, []);

  if (hasError) {
    return <p> Something went wrong</p>;
  }
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="attendees">
      <div className="attendees__number">
        <b>{data?.totalGuests}</b> guests already attending
      </div>
      <div className="attendees-display__container">
        {data?.attendees.map((attendee, index) => (
          <AtendeeTile
            profilePictureUrl={attendee.profilePictureUrl}
            firstName={attendee.firstName}
            key={index}
          />
        ))}
      </div>
    </div>
  );
}
