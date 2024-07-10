export interface MinimalEvent {
  id: string;
  name: string;
  month: string;
  day: string;
  weekday: string;
  colour: string;
  isOnline: boolean | null;
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
  time: string;
  location: string;
}

export interface Attendee {
  id: string;
  profilePictureUrl: string;
  firstName: string;
}

export interface AttendeesEvent {
  totalGuest: string;
  attendees: Attendee[];
}
