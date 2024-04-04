import { AttendeeRepository } from '@/modules/attendees/domain/AttendeeRepository';
import { Attendee } from '@/modules/attendees/domain/Attendee';

export async function getAttendees(
  attendeeRepository: AttendeeRepository,
  id:string, 
): Promise<Attendee[]> {
  return attendeeRepository.getAttendees(id);
}

