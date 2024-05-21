import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { eventMock } from '@/mocks/event';
import EventInfo from '@/ui/components/atoms/event-card/EventCard';
import { IconWithText } from '@/ui/components/atoms/icon-with-text/IconWithText';
import Section from '@/ui/components/molecules/section/Section';
import calendarClockImage from '@assets/icons/Calendar_clock_24.svg';
import locationImage from '@assets/icons/Location_24.svg';
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

  const eventRepository = createEventRepository();

  const emojiConvertor = new EmojiConvertor.EmojiConvertor();
  emojiConvertor.replace_mode = 'unified';

  const { time } = eventMock;

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

  useEffect(() => {
    eventDetails?.description ? sanitizeHtml(eventDetails?.description) : null;
  }, [eventDetails?.description]);

  if (eventDetails) {
    (eventDetails.description =
      '\u003cp\u003e:tada: Welcome Lunch for New Team Members! :knife_fork_plate:\u003c/p\u003e\u003cp\u003eLet’s celebrate our awesome new colleagues with a delicious lunch! Join us for good food and great company as we welcome them to the team.\u003c/p\u003e'),
      (eventDetails.location =
        'https://www.google.es/maps/place/Almog%C3%ADa,+M%C3%A1laga/@36.8295338,-4.5463116,16z/data=!3m1!4b1!4m6!3m5!1s0xd72f2f5a8739653:0x1ddcc904b7836d20!8m2!3d36.828836!4d-4.5411443!16s%2Fm%2F02r1t1c?hl=es&entry=ttu');
  }

  useEffect(() => {
    load(id);
  }, [id]);

  return (
    <Section
      className="eventDetail"
      refresh={() => load(id)}
      isLoading={isLoading}
      shouldRefresh={hasError}
    >
      {eventDetails ? (
        <>
          <EventInfo
            title={eventDetails?.summary?.name}
            month={eventDetails?.summary?.month}
            day={eventDetails?.summary?.day}
            isBoldTitle
            weekday={eventDetails?.summary?.weekday}
            colour={eventDetails?.summary?.colour}
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
          <div>
            <IconWithText
              icon={<img alt="Calendar" src={calendarClockImage} />}
            >
              {eventDetails.time}
            </IconWithText>
            {eventDetails.location && (
              <IconWithText icon={<img alt="Location" src={locationImage} />}>
                <div className="eventDescription__location">
                  <a href={eventDetails.location}>{eventDetails?.location}</a>
                </div>
              </IconWithText>
            )}
          </div>
        </>
      ) : (
        ''
      )}
    </Section>
  );
}
