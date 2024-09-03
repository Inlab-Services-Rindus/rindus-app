import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import EventCard from '@/ui/components/atoms/event-card/EventCard';
import { IconWithText } from '@/ui/components/atoms/icon-with-text/IconWithText';
import Section from '@/ui/components/molecules/section/Section';
import Attendance from '@/ui/components/organisms/attendance/Attendance';
import calendarClockImage from '@assets/icons/Calendar_clock_24.svg';
import conferenceImage from '@assets/icons/Conference_24.svg';
import locationImage from '@assets/icons/Location_24.svg';
import surveyOptions from '@assets/icons/Survey_Options_24.svg';
import DOMPurify from 'dompurify';
import { EmojiConvertor } from 'emoji-js';

import { getEventDetails } from '@/modules/events/application/get-details/getEventDetails';
import { DetailedEvent } from '@/modules/events/domain/Event';
import { createEventRepository } from '@/modules/events/infrastructure/EventRepository';

import '@/ui/section/event-detail/EventDetail.scss';

export function EventDetail() {
  const { id } = useParams();
  const [eventDetails, setEventDetails] = useState<DetailedEvent>();
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSurveyFilled, setIsSurveyFilled] = useState(false);
  const [surveyUrl, setSurveyUrl] = useState('');
  const [reset, setReset] = useState(true);

  const eventRepository = createEventRepository();

  // Create helper for this
  const emojiConvertor = new EmojiConvertor.EmojiConvertor();
  emojiConvertor.replace_mode = 'unified';

  const load = async (eventId?: string) => {
    if (eventId) {
      setHasError(false);
      try {
        const event: DetailedEvent = await getEventDetails(
          eventRepository,
          eventId,
        );
        setEventDetails(event);
      } catch (error) {
        setHasError(true);
      }
      setIsLoading(false);
    }
  };

  function sanitizeHtml(text: string) {
    return (
      DOMPurify.sanitize(text),
      {
        ALLOWED_TAGS: ['br', 'p'],
      }
    );
  }

  function updateEventCard(isSurveyFilled: boolean) {
    setIsSurveyFilled(isSurveyFilled);
  }

  function updateSurveyUrl(surveyUrl: string) {
    setSurveyUrl(surveyUrl);
  }

  function onBlurFunction() {
    if (reset) {
      setReset(false);

      window.location.reload();
    }
  }

  function handleClick() {
    setTimeout(() => {
      setReset(true);
    }, 10000);
  }

  useEffect(() => {
    eventDetails?.description ? sanitizeHtml(eventDetails?.description) : null;
  }, [eventDetails?.description]);

  useEffect(() => {
    load(id);
    setReset(false);
  }, [id]);

  useEffect(() => {
    window.addEventListener('scroll', onBlurFunction);
    window.addEventListener('resize', onBlurFunction);

    return () => {
      window.removeEventListener('scroll', onBlurFunction);
      window.removeEventListener('resize', onBlurFunction);
    };
  }, []);

  function renderConferenceInfo() {
    if (eventDetails?.conferenceUrl) {
      return (
        <IconWithText icon={<img alt="Conference" src={conferenceImage} />}>
          <div className="eventDescription__location">
            <a
              href={eventDetails?.conferenceUrl}
              className="eventDescription__link"
            >
              <span className="eventDescription__title">
                {eventDetails?.conferenceUrl}
              </span>
            </a>
          </div>
        </IconWithText>
      );
    }
  }

  function renderLocationInfo() {
    if (eventDetails?.location.url) {
      return (
        <IconWithText icon={<img alt="Location" src={locationImage} />}>
          <div className="eventDescription__location">
            <a
              href={eventDetails?.location.url}
              className="eventDescription__link"
            >
              <span className="eventDescription__title">
                {eventDetails?.location.placeName}
              </span>
              <span className="eventDescription__subtitle">
                {eventDetails?.location.placeAddress}
              </span>
            </a>
          </div>
        </IconWithText>
      );
    }
  }

  return (
    <Section
      className="eventDetail"
      refresh={() => load(id)}
      isLoading={isLoading}
      shouldRefresh={hasError}
    >
      {eventDetails && (
        <>
          <EventCard
            title={eventDetails?.summary?.name}
            month={eventDetails?.summary?.month}
            day={eventDetails?.summary?.day}
            isBoldTitle
            weekday={eventDetails?.summary?.weekday}
            colour={eventDetails?.summary?.colour}
            isOnlineEvent={eventDetails?.isOnlineEvent}
            isSurveyFilled={isSurveyFilled}
          />
          <div className="eventDescription">
            <div
              className="eventDescription__description"
              dangerouslySetInnerHTML={{
                __html: emojiConvertor.replace_colons(
                  eventDetails?.description,
                ),
              }}
            ></div>
          </div>
          <div className="eventDescription__info">
            <IconWithText
              icon={<img alt="Calendar" src={calendarClockImage} />}
            >
              {eventDetails?.time}
            </IconWithText>
            {renderConferenceInfo()}
            {renderLocationInfo()}
          </div>
        </>
      )}
      <Attendance
        id={id}
        updateEventCard={updateEventCard}
        updateSurveyUrl={updateSurveyUrl}
      />

      {!isSurveyFilled && surveyUrl && (
        <div className="eventDescription__button-container">
          <a
            className="eventDescription__button"
            href={surveyUrl}
            onClick={handleClick}
          >
            <IconWithText
              icon={<img alt="Survey Options" src={surveyOptions} />}
            >
              <p>Confirm attendance</p>
            </IconWithText>
          </a>
        </div>
      )}
    </Section>
  );
}
