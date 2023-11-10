import { User } from '@/models/business/User';

export interface Partner {
  id: number;
  name: string;
  logoUrl: string;
  description: string;
}

export interface PartnerMembers {
  members: Member[];
  captains: Member[];
}

export interface Member extends User {}
