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


function getMonthColor(dateTime: string): string {
  return MONTHS_COLORS[new Date(dateTime).getMonth()];
}
function getMonthName(dateTime: string): string {
  return new Date(dateTime).toLocaleDateString('en', { month: 'long' });
}
function getDay(dateTime: string): string {
  return new Date(dateTime).getDate().toString();
}
function getWeekday(dateTime: string): string {
  return new Date(dateTime).toLocaleDateString('en', { weekday: 'long' });
}

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
      month: getMonthName(event.start.dateTime),
      day: getDay(event.start.dateTime),
      weekday: getWeekday(event.start.dateTime),
      colour: getMonthColor(event.start.dateTime),
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
        month: getMonthName(event.start.dateTime),
        day: getDay(event.start.dateTime),
        weekday: getWeekday(event.start.dateTime),
        colour: getMonthColor(event.start.dateTime),
      },
      description: event?.description || '',
      time: `${new Date(event.start.dateTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })} - ${new Date(event.end?.dateTime ?? '').toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}`,
      location: event?.location || '',
    };
  }
}
