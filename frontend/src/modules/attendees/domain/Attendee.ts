export interface EventAttendance {
  totalGuest: number;
  attendees: Attendee[];
}

export interface Attendee {
  id: number;
  profilePictureUrl: string;
  firstName: string;
}
