import breakIcon from '@/assets/icons/Break_icon_4.svg';
import '@/ui/components/atoms/event-summary/EventSummary.scss';

interface EventSummaryProps {
  isSurveyFilled: boolean;
}

function EventSummary({ isSurveyFilled }: EventSummaryProps) {
  const renderContent = () => {
    if (isSurveyFilled) {
      return <div className="surveyFilled">Survey Filled</div>;
    } else {
      return <div className="onlineEvent">Online Event</div>;
    }
  };

  return (
    <div className="eventSummary">
      <div className="eventSummary__breakIcon">
        <img alt="SVG Break" src={breakIcon} />
      </div>
      <p className="eventSummary__survey">{renderContent()}</p>
    </div>
  );
}

export default EventSummary;
