export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profilePictureUrl: string;
  isBirthday?: boolean;
}

export interface EmployeeProfile extends Employee {
  position: string;
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
