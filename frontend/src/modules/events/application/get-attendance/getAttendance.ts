import { EventAttendanceInfo } from '@/modules/events/domain/AttendeesEvent';
import { AttendeesEventRepository } from '@/modules/events/domain/AttendeesEventRepository';

export async function getAttendance(
  attendeesEventRepository: AttendeesEventRepository,
  eventID: string,
): Promise<EventAttendanceInfo> {
  return attendeesEventRepository.getAttendance(eventID);
}
