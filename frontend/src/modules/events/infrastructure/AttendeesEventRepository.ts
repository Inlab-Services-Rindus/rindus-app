import { config } from '@/config/config';

import { EventAttendanceInfo } from '@/modules/events//domain/AttendeesEvent';
import { AttendeesEventRepository } from '@/modules/events/domain/AttendeesEventRepository';

export function createEventAttendeesRepository(): AttendeesEventRepository {
  return {
    getAttendance,
  };
}

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

    const attendance = response.json() as Promise<EventAttendanceInfo>;
    return attendance;
  } catch (error) {
    throw new Error('Error fetching attendees');
  }
}
