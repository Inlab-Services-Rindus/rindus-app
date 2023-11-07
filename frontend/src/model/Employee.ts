export interface Employee {
  firstName: string;
  lastName: string;
  email: string;
  profilePictureUrl: string;
  isBirthday?: boolean;
  id: string;
}

export interface EmployeeProfile extends Employee {
  position?: string;
  office: string;
  department?: Department;
  languages: string[];
  slack: Slack;
}

interface Department {
  name: string;
  logoUrl: string;
}

interface Slack {
  name: string;
  profileUrl: string;
}