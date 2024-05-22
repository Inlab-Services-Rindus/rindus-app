import { DetailedEvent } from '@/modules/events/domain/Event';

export const eventMock: DetailedEvent = {
  id: '1',
  summary: {
    name: 'Woman Day',
    month: 'May',
    day: '08',
    weekday: 'Friday',
    colour: 'black',
  },
  description:
    '\u003cp\u003e:tada: Welcome Lunch for New Team Members! :knife_fork_plate:\u003c/p\u003e\u003cp\u003eLet’s celebrate our awesome new colleagues with a delicious lunch! Join us for good food and great company as we welcome them to the team.\u003c/p\u003e',
  location: 'www.zoom.com',
  time: '13:00 - 15:00',
};
