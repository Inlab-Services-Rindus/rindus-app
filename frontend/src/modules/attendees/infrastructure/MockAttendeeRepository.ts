import { attendeesMock } from '@/mocks/attendees';

import { Attendee } from '@/modules/attendees/domain/Attendee';
import { AttendeeRepository } from '@/modules/attendees/domain/AttendeeRepository';

export function createMockAttendeeRepository(): AttendeeRepository {
  return {
    getAttendees,
    getTotalGuests,
  };
}

export async function getTotalGuests(): Promise<number> {
  return Promise.resolve(attendeesMock.totalGuests);
}

export async function getAttendees(): Promise<Attendee[]> {
  return Promise.resolve(attendeesMock.attendees);
}
