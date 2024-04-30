import { Attendee } from '@/modules/attendees/domain/Attendee';

export interface AttendeeRepository {
  getTotalGuests: (eventID: string) => Promise<number>;
  getAttendees: (eventID: string) => Promise<Attendee[]>;
}
