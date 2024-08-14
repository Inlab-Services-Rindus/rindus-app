import { EventAttendanceInfo } from '@/modules/events/domain/AttendeesEvent';
import { AttendeesEventRepository } from '@/modules/events/domain/AttendeesEventRepository';

export async function getAttendance(
  attendeesEventRepository: AttendeesEventRepository,
  eventID: string,
  refreshCache: boolean,
): Promise<EventAttendanceInfo> {
  return attendeesEventRepository.getAttendance(eventID, refreshCache);
}
