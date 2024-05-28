import { DetailedEvent } from '@/modules/events/domain/Event';
import { EventRepository } from '@/modules/events/domain/EventRepository';

export async function getEventDetails(
  eventRepository: EventRepository,
  id: string,
): Promise<DetailedEvent> {
  return eventRepository.getEventDetails(id);
}
