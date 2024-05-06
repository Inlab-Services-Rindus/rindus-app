import { attendeesMock } from '@/mocks/attendees';

import { EventAttendance } from '@/modules/attendees/domain/Attendee';
import { AttendeeRepository } from '@/modules/attendees/domain/AttendeeRepository';

export function createMockAttendeeRepository(): AttendeeRepository {
  return {
    getAttendance,
  };
}

export async function getAttendance(): Promise<EventAttendance> {
  return Promise.resolve(attendeesMock);
}
