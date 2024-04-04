import { AttendeeRepository } from '@/modules/attendees/domain/AttendeeRepository';

export async function getGuests(
  attendeeRepository: AttendeeRepository,
  id: string,
): Promise<number> {
  return attendeeRepository.getTotalGuests(id);
}
