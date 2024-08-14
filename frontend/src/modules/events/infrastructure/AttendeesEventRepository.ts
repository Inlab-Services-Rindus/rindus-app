import { config } from '@/config/config';

import { EventAttendanceInfo } from '@/modules/events//domain/AttendeesEvent';
import { AttendeesEventRepository } from '@/modules/events/domain/AttendeesEventRepository';

export function createEventAttendeesRepository(): AttendeesEventRepository {
  return {
    getAttendance,
  };
}

async function getAttendance(id: string, refreshCache: boolean) {
  try {
    const url = new URL(
      `${config.backendUrl}/google/v1/events/${id}/attendees`,
    );

    if (refreshCache) {
      url.searchParams.append('refresh', 'true');
    }

    const response = await fetch(url.toString(), {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Error fetching attendees');
    }

    const attendance = response.json() as Promise<EventAttendanceInfo>;
    return attendance;
  } catch (error) {
    throw new Error('Error fetching attendees');
  }
}
