import { config } from '@/config/config';

import { Event } from '@/modules/events/domain/Event';
import { EventRepository } from '@/modules/events/domain/EventRepository';

export function createEventRepository(): EventRepository {
  return {
    getAll,
  };
}

export async function getAll() {
  try {
    const response = await fetch(`${config.backendUrl}/google/v1/events`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Error fetching events');
    }

    const partners = response.json() as Promise<Event[]>;
    return partners;
  } catch (error) {
    throw new Error('Error fetching events');
  }
}
