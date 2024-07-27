export interface EventAttendanceInfo {
  isSurveyFilled: boolean;
  employees: EmployeeEventAttendee[];
  totalAttendees: number;
  totalNewRinders: number;
}

export interface EmployeeEventAttendee {
  id: number;
  profilePictureUrl: string;
  firstName: string;
}
