import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import EventCard from '@/ui/components/atoms/event-card/EventCard';
import Section from '@/ui/components/molecules/section/Section';

import { StoreContext } from '@/ui/context/store/Store';

import '@/ui/section/home/events-tab/EventsTab.scss';

export default function EventsTab() {
  const navigate = useNavigate();
  const {
    events: { data, isLoading, hasError },
    getEvents,
  } = useContext(StoreContext);

  function goToEventDetails(eventId: string) {
    navigate(`/event/${eventId}`);
  }

  useEffect(() => {
    getEvents();
  }, []);

  return (
    <Section
      isLoading={isLoading}
      className="events-tab__container"
      dataTestId="events-tab"
      refresh={getEvents}
      shouldRefresh={hasError}
    >
      {data?.map((event, index) => (
        <article key={index}>
          <EventCard
            title={event.name}
            month={event.month}
            day={event.day}
            weekday={event.weekday}
            colour={event.colour}
            isButtonVisible={false}
            isBoldTitle={false}
            handleClick={() => goToEventDetails(event.id)}
          />
        </article>
      ))}
    </Section>
  );
}
