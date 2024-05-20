import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Loader from '../../atoms/loader/Loader';
import Section from '../../molecules/section/Section';
import '@/mocks/attendees.ts';
import AtendeeTile from '@/ui/components/organisms/atendee-tile/AtendeeTile';

import { getAttendance } from '@/modules/attendees/application/get-attendance/getAttendance';
import { EventAttendance } from '@/modules/attendees/domain/Attendee';
import { createAttendeeRepository } from '@/modules/attendees/infrastructure/AttendeeRepository';

import '@/ui/components/organisms/attendance/Attendance.scss';

interface Props {
  id: string;
}
export default function Attendance({ id }: Props) {
  const navigate = useNavigate();

  const [attendance, setAttendance] = useState<EventAttendance>();
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const attendeeRepository = createAttendeeRepository();

  const load = async (eventId: string) => {
    if (eventId) {
      setHasError(false);
      try {
        const attendance = await getAttendance(attendeeRepository, eventId);
        setAttendance(attendance);
      } catch (error) {
        setHasError(true);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load(id);
  }, [id]);

  if (hasError) {
    return <p>Something went wrong</p>;
  }

  function renderContent() {
    if (isLoading) {
      return <Loader />;
    }
    return (
      <>
        <div className="attendees__number">
          <b>{attendance?.totalGuest}</b> guests already attending
        </div>
        <div className="attendees__display__container">
          {attendance?.attendees.map((attendee, index) => (
            <AtendeeTile
              onClick={() => {
                navigate(`/profile/${attendee.id}`);
              }}
              profilePictureUrl={attendee.profilePictureUrl}
              firstName={attendee.firstName}
              key={index}
            />
          ))}
        </div>
      </>
    );
  }
  return <div className="attendees">{renderContent()}</div>;
}
