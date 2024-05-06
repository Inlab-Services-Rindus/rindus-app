import { Event } from '@/modules/events/domain/Event';
import { EventRepository } from '@/modules/events/domain/EventRepository';

export async function getAllEvents(
  eventRepository: EventRepository,
): Promise<Event[]> {
  return eventRepository.getAll();
}
