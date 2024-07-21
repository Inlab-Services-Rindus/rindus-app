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
  description: string;
  time: string;
  location: string;
}

export interface EmployeeEventAttendee {
  id: string;
  profilePictureUrl: string;
  firstName: string;
}

export interface AttendeesEventResponse {
  isSurveyFilled: boolean;
  employees: EmployeeEventAttendee[];
  totalAttendees: number;
  totalNewRindes: number;
}
