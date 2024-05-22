import { DetailedEvent, Event } from '@/modules/events/domain/Event';

export interface EventRepository {
  getAll: () => Promise<Event[]>;
  getEventDetails: (id: string) => Promise<DetailedEvent>;
}
