export interface MinimalEvent {
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
  isOnlineEvent: boolean;
  description: string;
  time: string;
  locationUrl: string;
  conferenceUri: string;
}

export interface Attendee {
  id: string;
  profilePictureUrl: string;
  firstName: string;
}

export interface AttendeesEvent {
  totalGuest: string;
  attendees: Attendee[];
  isSurveyFilled: boolean;
}
