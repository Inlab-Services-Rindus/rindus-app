export interface Event {
  id: string;
  name: string;
  month: string;
  day: string;
  weekday: string;
  colour: string;
}

interface EventLocation {
  url: string;
  placeName: string;
  placeAddress: string;
}

export interface DetailedEvent {
  id: string;
  summary: {
    name: string;
    month: string;
    day: string;
    weekday: string;
    colour: string;
  };
  isOnlineEvent: boolean;
  description: string;
  location: EventLocation;
  time: string;
}
