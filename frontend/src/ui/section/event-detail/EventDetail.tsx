import { useParams } from 'react-router-dom';

import { eventMock } from '@/mocks/event';
import EventDescription from '@/ui/components/atoms/event-description/EventDescription';
import EventInfo from '@/ui/components/atoms/event-info/EventInfo';
import { IconWithText } from '@/ui/components/atoms/icon-with-text/IconWithText';
import calendarClockImage from '@assets/icons/Calendar_clock_24.svg';
import locationImage from '@assets/icons/Location_24.svg';
import petsImage from '@assets/icons/Pets_24.svg';

import '@/ui/section/event-detail/EventDetail.scss';

export function EventDetail() {
  const { id } = useParams();
  const {
    title,
    month,
    day,
    weekday,
    location,
    description,
    time,
    petsAllowed,
    isSurveyFilled = false,
  } = eventMock;

  // TODO: When backend is ready check if event exist or not and modify this condition
  return (
    <div className="eventDetail">
      {id ? (
        <EventInfo
          title={title}
          month={month}
          day={day}
          isBoldTitle
          weekday={weekday}
          location={location.url}
          isSurveyFilled={isSurveyFilled}
        />
      ) : (
        <p>
          The event you&apos;re looking for doesn&apos;t seems to exist. Please
          try again.
        </p>
      )}
      <EventDescription description={description} />
      <IconWithText
        title={location.name}
        subtitle={location.address}
        icon={<img alt="Location" src={locationImage} />}
      />
      <IconWithText
        title={time}
        icon={<img alt="Calendar" src={calendarClockImage} />}
      />
      {petsAllowed && (
        <IconWithText
          title="Pets are welcome"
          icon={<img alt="Pets" src={petsImage} />}
        />
      )}
    </div>
  );
}
