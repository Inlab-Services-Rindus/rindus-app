import { Converter } from '@/converters/Converter';
import {
  MinimalEvent as ApiMinimalEvent,
  DetailedEvent as ApiDetailedEvent,
} from '@/models/api/google/Google';
import { calendar_v3 } from 'googleapis';

const MONTHS_COLORS = [
  '#2C4D6E',
  '#74CBFB',
  '#7578EA',
  '#4DD699',
  '#FF8C61',
  '#74CBFB',
  '#F0AE5D',
  '#FF8C61',
  '#4DD699',
  '#7578EA',
  '#00C18C',
  '#E8505B',
];

export class MinimalEventConverter
  implements Converter<calendar_v3.Schema$Event, ApiMinimalEvent>
{
  convert(event: calendar_v3.Schema$Event): ApiMinimalEvent {
    if (
      !event ||
      !event?.id ||
      !event?.summary ||
      !event?.start ||
      !event?.start?.dateTime
    ) {
      throw new Error('Invalid event');
    }

    return {
      id: event.id,
      name: event.summary,
      month: (new Date(event.start.dateTime).getMonth() + 1).toString(),
      day: new Date(event.start.dateTime).getUTCDay().toString(),
      weekday: new Date(event.start.dateTime).toLocaleDateString('en', {
        weekday: 'long',
      }),
      colour: MONTHS_COLORS[new Date(event.start.dateTime).getMonth()],
    };
  }
}

export class DetailedEventConverter
  implements Converter<calendar_v3.Schema$Event, ApiDetailedEvent>
{
  convert(event: calendar_v3.Schema$Event): ApiDetailedEvent {
    if (
      !event ||
      !event?.id ||
      !event?.summary ||
      !event?.start ||
      !event?.start?.dateTime
    ) {
      throw new Error('Invalid detailed event');
    }

    return {
      id: event.id,
      summary: {
        name: event.summary,
        month: (new Date(event.start.dateTime).getMonth() + 1).toString(),
        day: new Date(event.start.dateTime).getUTCDay().toString(),
        weekday: new Date(event.start.dateTime).toLocaleDateString('en', {
          weekday: 'long',
        }),
        colour: MONTHS_COLORS[new Date(event.start.dateTime).getMonth()],
      },
      description: event?.description || '',
      location: event?.location || '',
    };
  }
}
