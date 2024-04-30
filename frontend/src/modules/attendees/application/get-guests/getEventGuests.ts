import { AttendeeRepository } from '@/modules/attendees/domain/AttendeeRepository';

export async function getTotalGuests(
  attendeeRepository: AttendeeRepository,
  eventID: string,
): Promise<number> {
  return attendeeRepository.getTotalGuests(eventID);
}
