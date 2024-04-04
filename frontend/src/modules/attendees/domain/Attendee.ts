export interface EventAttendance {
  totalGuests: number;
  attendees: Attendee[];
}

export interface Attendee {
  id: number;
  profilePictureUrl: string;
  firstName: string;
}
