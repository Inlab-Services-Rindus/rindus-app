import { Event } from '@/modules/events/domain/Event';

export interface EventRepository {
  getAll: () => Promise<Event[]>;
}
