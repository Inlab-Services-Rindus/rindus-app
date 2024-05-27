import { AttendeeRepository } from '@/modules/attendees/domain/AttendeeRepository';
import { EventAttendance } from '@/modules/attendees/domain/Attendee';

export async function getAttendance(
  attendeeRepository: AttendeeRepository,
  eventID:string, 
): Promise<EventAttendance> {
  return attendeeRepository.getAttendance(eventID);
}

