export interface PersonioData {
  data: Items;
}

interface Items {
  items: EmployeeData[];
}

interface EmployeeData {
  id: number;
  data: Employee;
}

export interface Employee {
  first_name: string;
  last_name: string;
  email: string;
  office_id: string;
  department_id: string;
  position: string;
  full_name: string;
  team_id: string;
  dynamic_87778: string; // Birthday
  dynamic_1298673: string; // Team Captain
  dynamic_1300584: string; // Languages
  profile_picture_url: string;
}
