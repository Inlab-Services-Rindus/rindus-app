export interface EventAttendanceInfo {
  isSurveyFilled: boolean;
  employees: EmployeeEventAttendee[];
  totalAttendees: number;
  totalNewRinders: number;
  surveyUrl: string;
}

export interface EmployeeEventAttendee {
  id: number;
  profilePictureUrl: string;
  firstName: string;
}
