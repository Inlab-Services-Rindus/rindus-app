import '@/ui/components/atoms/event-description/EventDescription.scss';

interface EventDescriptionProps {
  description: string;
}

function EventDescription({ description }: EventDescriptionProps) {
  return (
    <section className="eventDescription">
      <p>{description}</p>
    </section>
  );
}

export default EventDescription;
