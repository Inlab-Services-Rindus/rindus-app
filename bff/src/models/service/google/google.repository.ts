import { AttendeesEvent } from '@/models/api/google/Google';
import { calendar_v3 } from 'googleapis';

export interface GoogleRepository {
  events(): Promise<calendar_v3.Schema$Events[]>;
  event(eventId: string): Promise<calendar_v3.Schema$Event>;
  attendees(eventId: string): Promise<AttendeesEvent>;
}
