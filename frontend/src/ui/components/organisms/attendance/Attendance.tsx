import { useContext, useEffect } from 'react';

import '@/mocks/attendees.ts';
import Loader from '@/ui/components/atoms/loader/Loader';
import AtendeeTile from '@/ui/components/organisms/atendee-tile/AtendeeTile';

import { StoreContext } from '@/ui/context/store/Store';

import '@/ui/components/organisms/attendance/Attendance.scss';

export default function Attendance() {
  const id = '497ib8tk658ck2mon1n2ujh0rq';
  const {
    attendance: { data, isLoading, hasError },
    getAttendance,
  } = useContext(StoreContext);

  const actionGetAttendance = (id: string) => {
    getAttendance(id);
  };

  useEffect(() => {
    actionGetAttendance(id);
  }, []);

  if (hasError) {
    return <p>Something went wrong</p>;
  }
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="attendees">
      <div className="attendees__number">
        <b>{data?.totalGuests}</b> guests already attending
      </div>
      <div className="attendees__display__container">
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
