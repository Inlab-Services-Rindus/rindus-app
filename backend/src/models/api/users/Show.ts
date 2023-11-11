import { User } from '@/models/api/User';

export interface UserProfile extends User {
  languages: string[];
  office: string;
  department: Department;
  position: string;
  slack: Slack;
}

export interface Department {
  id: number | null; // null for employees that work for rindus
  name: string;
  logoUrl: string;
}

export interface Slack {
  name: string;
  profileUrl: string;
}