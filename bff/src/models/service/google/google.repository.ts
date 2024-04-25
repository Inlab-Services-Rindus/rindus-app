import { Event } from '@/models/business/Google';

export interface GoogleRepository {
  events(): Promise<Event[]>;
  event(eventId: string): Promise<Event>;
}
