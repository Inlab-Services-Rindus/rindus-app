import { EmployeeProfile } from '@/model/Employee';

export interface Partner {
  id: number;
  name: string;
  logoUrl: string;
  description: string;
}

export interface PartnerMembers {
  members: EmployeeProfile[];
  captains: EmployeeProfile[];
}
