import breakIcon from '@/assets/icons/Break_icon_4.svg';

import '@/ui/components/atoms/event-summary/EventSummary.scss';

interface EventSummaryProps {
  children: React.ReactNode;
}

function EventSummary({ children }: EventSummaryProps) {
  return (
    <div className="eventSummary">
      <div className="eventSummary__breakIcon">
        <img alt="SVG Break" src={breakIcon} />
      </div>
      <p className="eventSummary__survey">{children}</p>
    </div>
  );
}

function OnlineEventTag() {
  return (
    <EventSummary>
      <div className="onlineEvent">Online Event</div>
    </EventSummary>
  );
}

function SurveyFilledTag() {
  return (
    <EventSummary>
      <div className="surveyFilled">Survey Filled</div>
    </EventSummary>
  );
}

export { OnlineEventTag, SurveyFilledTag };
