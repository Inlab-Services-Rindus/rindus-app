import { AttendeesEvent } from '@/models/api/google/Google';
import { calendar_v3 } from 'googleapis';

export interface GoogleRepository {
  events(): Promise<calendar_v3.Schema$Events[]>;
  event(eventId: string): Promise<calendar_v3.Schema$Event>;
  attendees(userId: number, eventId: string): Promise<AttendeesEvent>;
}
