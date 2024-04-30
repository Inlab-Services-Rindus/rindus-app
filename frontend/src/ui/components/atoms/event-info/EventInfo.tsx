import RightButton from '@/ui/components/atoms/buttons/right-button/RightButton';
import EventSummary from '@/ui/components/atoms/event-summary/EventSummary';

import { getBackgroundColor } from '@/ui/helpers/getBackgroundColor';

import '@/assets/scss/_fonts.scss';
import '@/ui/components/atoms/event-info/EventInfo.scss';

interface EventInfoProps {
  title: string;
  month: string;
  day: string;
  weekday: string;
  location: string;
  isSurveyFilled: boolean;
  isButtonVisible?: boolean;
  isBoldTitle?: boolean;
}

function EventInfo({
  title,
  month,
  day,
  weekday,
  location,
  isSurveyFilled,
  isButtonVisible = false,
  isBoldTitle = false,
}: EventInfoProps) {
  const isPresential = location.includes('maps'); // TODO: Temporary condition to control if the event is online or not
  const isEventSummaryActive = isSurveyFilled || !isPresential;

  const renderTitle = () => {
    if (isBoldTitle) {
      return <h2 className="details__boldTitle">{title}</h2>;
    } else {
      return <h3 className="details__title">{title}</h3>;
    }
  };

  return (
    <section className="eventInfo">
      <article className="eventInfo__dateDetails">
        <div
          className="date"
          style={{ backgroundColor: getBackgroundColor(month) }}
        >
          <p className="day">{day}</p>
          <p className="month">{month}</p>
        </div>
        <div className="details">
          {renderTitle()}
          <div className="details__info">
            <p className="weekday">{weekday}</p>
            {isEventSummaryActive && (
              <EventSummary isSurveyFilled={isSurveyFilled} />
            )}
          </div>
        </div>
      </article>
      {isButtonVisible && (
        <article className="eventInfo__button">
          <RightButton />
        </article>
      )}
    </section>
  );
}

export default EventInfo;
