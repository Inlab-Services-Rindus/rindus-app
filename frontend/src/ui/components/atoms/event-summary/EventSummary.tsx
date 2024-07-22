import breakIcon from '@/assets/icons/Break_icon_4.svg';

import '@/ui/components/atoms/event-summary/EventSummary.scss';

interface EventSummaryProps {
  isOnlineEvent: boolean;
}

function EventSummary({ isOnlineEvent }: EventSummaryProps) {
  if (!isOnlineEvent) return null;

  return (
    <div className="eventSummary" data-testid="event-summary">
      <div className="eventSummary__breakIcon">
        <img alt="SVG Break" src={breakIcon} />
      </div>
      <span className="eventSummary__onlineEvent">Online Event</span>
    </div>
  );
}

export default EventSummary;
