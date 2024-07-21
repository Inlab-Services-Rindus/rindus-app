export interface EventAttendanceInfo {
  isSurveyFilled: boolean;
  employees: EmployeeEventAttendee[];
  totalAttendees: number;
  totalNewRindes: number;
}

export interface EmployeeEventAttendee {
  id: number;
  profilePictureUrl: string;
  firstName: string;
}
