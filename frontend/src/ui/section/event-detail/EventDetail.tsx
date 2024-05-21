import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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
