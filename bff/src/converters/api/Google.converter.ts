import { Converter } from '@/converters/Converter';
import { Event as ApiEvent } from '@/models/api/google/Google';
import { Event as BusinessEvent } from '@/models/business/Google';

export class EventConverter implements Converter<BusinessEvent, ApiEvent> {
  private readonly MONTHS_COLORS = [
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

  convert(event: BusinessEvent): ApiEvent {
    return {
      id: event.id,
      name: event.summary,
      month: (new Date(event.start.dateTime).getMonth() + 1).toString(),
      day: new Date(event.start.dateTime).getUTCDay().toString(),
      weekday: new Date(event.start.dateTime).toLocaleDateString('en', {
        weekday: 'long',
      }),
      colour: this.MONTHS_COLORS[new Date(event.start.dateTime).getMonth()],
    };
  }
}
