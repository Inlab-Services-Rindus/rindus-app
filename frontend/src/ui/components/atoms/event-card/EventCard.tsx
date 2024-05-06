import RightButton from '@/ui/components/atoms/buttons/right-button/RightButton';

import { BEMClassHelper } from '@/ui/helpers/BEMClassHelper';

import '@/ui/components/atoms/event-card/EventCard.scss';

interface EventCardProps {
  title: string;
  month: string;
  day: string;
  weekday: string;
  colour: string;
  isButtonVisible?: boolean;
  isBoldTitle?: boolean;
}

function EventCard({
  title,
  month,
  day,
  weekday,
  colour,
  isButtonVisible = false,
  isBoldTitle = false,
}: EventCardProps) {
  return (
    <div className="eventCard" data-testid="event-card">
      <div className="eventCard__dateDetails">
        <div className="date" style={{ backgroundColor: colour }}>
          <p className="day">{day}</p>
          <p className="month">{month.substring(0, 3)}</p>
        </div>
        <div className="details">
          <h2
            className={BEMClassHelper(
              'details',
              'title',
              isBoldTitle && 'bold',
            )}
          >
            {title}
          </h2>
          <div className="details__info">
            <p className="weekday">{weekday}</p>
          </div>
        </div>
      </div>
      {isButtonVisible && (
        <div className="eventCard__button">
          <RightButton />
        </div>
      )}
    </div>
  );
}

export default EventCard;
