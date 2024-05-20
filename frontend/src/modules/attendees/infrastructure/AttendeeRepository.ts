// import { attendeesMock } from '@/mocks/attendees';
import { config } from '@/config/config';

import { EventAttendance } from '@/modules/attendees/domain/Attendee';
import { AttendeeRepository } from '@/modules/attendees/domain/AttendeeRepository';

export function createAttendeeRepository(): AttendeeRepository {
  return {
    getAttendance,
  };
}

// export async function getAttendance(): Promise<EventAttendance> {
//   return Promise.resolve(attendeesMock);
// }

export async function getAttendance(id: string) {
  try {
    const response = await fetch(
      `${config.backendUrl}/google/v1/events/${id}/attendees`,
      {
        credentials: 'include',
      },
    );

    if (!response.ok) {
      throw new Error('Error fetching attendees');
    }

    const attendance = response.json() as Promise<EventAttendance>;
    return attendance;
  } catch (error) {
    throw new Error('Error fetching attendees');
  }
}
