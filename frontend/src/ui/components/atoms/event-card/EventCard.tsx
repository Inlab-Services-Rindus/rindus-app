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
  handleClick?: () => void;
}
function EventCard({
  title,
  month,
  day,
  weekday,
  colour,
  isButtonVisible = false,
  isBoldTitle = false,
  handleClick,
}: EventCardProps) {
  return (
    <div className="eventCard" data-testid="event-card" onClick={handleClick}>
      <div className="eventCard__dateDetails">
        <div
          className="date"
          style={{ backgroundColor: colour }}
          data-testid="event-card-date"
        >
          <p className="day">{day}</p>
          <p className="month">{month.substring(0, 3)}</p>
        </div>
        <div className="details">
          <div className="details__info">
            <h2
              className={BEMClassHelper(
                'details',
                'title',
                isBoldTitle && 'bold',
              )}
            >
              {title}
            </h2>
            <p className="details__weekday">{weekday}</p>
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
