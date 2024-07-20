export interface Event {
  id: string;
  name: string;
  month: string;
  day: string;
  weekday: string;
  colour: string;
  isOnlineEvent: boolean;
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
  location: string;
  time: string;
  isOnlineEvent: boolean;
}
