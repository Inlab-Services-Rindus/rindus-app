export interface Event {
  id: string;
  name: string;
  month: string;
  day: string;
  weekday: string;
  colour: string;
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
  description: string;
  locationUrl: string;
  time: string;
}
