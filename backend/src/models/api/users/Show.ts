import { User } from '@/models/api/User';

export interface UserProfile extends User {
  languages: string[];
  office: string;
  department: Department;
  position: string;
  slack: Slack;
}

export interface Department {
  name: string;
  logoUrl: string;
}

export interface Slack {
  name: string;
  profileUrl: string;
}
