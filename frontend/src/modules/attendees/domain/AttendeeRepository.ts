import { Attendee } from '@/modules/attendees/domain/Attendee';

export interface AttendeeRepository {
  getTotalGuests: (id: string) => Promise<number>;
  getAttendees: (id: string) => Promise<Attendee[]>;
}
