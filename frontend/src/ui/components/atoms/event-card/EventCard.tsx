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
        {isButtonVisible && (
          <div className="button__container">
            <RightButton />
          </div>
        )}
      </div>
    </div>
  );
}
export default EventCard;
