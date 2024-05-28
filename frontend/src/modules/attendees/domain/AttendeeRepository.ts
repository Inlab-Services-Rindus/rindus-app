import { EventAttendance } from '@/modules/attendees/domain/Attendee';

export interface AttendeeRepository {
  getAttendance: (eventID: string) => Promise<EventAttendance>;
}
