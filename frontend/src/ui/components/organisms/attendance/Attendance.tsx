import { useEffect, useState } from 'react';

import Loader from '@/ui/components/atoms/loader/Loader';
import AtendeeTile from '@/ui/components/organisms/atendee-tile/AtendeeTile';

import { getAttendance } from '@/modules/events/application/get-attendance/getAttendance';
import { EventAttendanceInfo } from '@/modules/events/domain/AttendeesEvent';
import { createEventAttendeesRepository } from '@/modules/events/infrastructure/AttendeesEventRepository';

import '@/ui/components/organisms/attendance/Attendance.scss';

interface Props {
  id: string | undefined;
}
export default function Attendance({ id }: Props) {
  const [eventAttendanceInfo, setEventAttendanceInfo] =
    useState<EventAttendanceInfo>();
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const attendeeRepository = createEventAttendeesRepository();

  const load = async (eventId?: string) => {
    if (eventId) {
      setHasError(false);
      try {
        const eventAttendanceInfoResponse = await getAttendance(
          attendeeRepository,
          eventId,
        );
        setEventAttendanceInfo(eventAttendanceInfoResponse);
      } catch (error) {
        setHasError(true);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load(id);
  }, [id]);

  if (!id) {
    return null;
  }
  if (hasError) {
    return <p className="hasError">No attendance yet for this event</p>;
  }

  function guestsText() {
    if (eventAttendanceInfo?.totalAttendees === 1) {
      return ' guest already attending';
    } else {
      return ' guests already attending';
    }
  }

  function renderContent() {
    if (eventAttendanceInfo?.totalAttendees === 0) {
      return null;
    }
    if (isLoading) {
      return (
        <div className="attendees__loader">
          <Loader />
        </div>
      );
    }
    return (
      <>
        <div className="attendees__number">
          <b>{eventAttendanceInfo?.totalAttendees}</b>
          {guestsText()}
        </div>
        <div className="attendees__display__container">
          {eventAttendanceInfo?.employees.map((employee) => (
            <AtendeeTile
              profilePictureUrl={employee.profilePictureUrl}
              firstName={employee.firstName}
              id={employee.id}
              key={employee.id}
            />
          ))}
        </div>
      </>
    );
  }
  return <div className="attendees">{renderContent()}</div>;
}
