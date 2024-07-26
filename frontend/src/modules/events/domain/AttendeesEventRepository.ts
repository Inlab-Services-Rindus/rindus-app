import { EventAttendanceInfo } from '@/modules/events/domain/AttendeesEvent';

export interface AttendeesEventRepository {
  getAttendance: (eventID: string) => Promise<EventAttendanceInfo>;
}
