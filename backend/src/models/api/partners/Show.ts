import { Partner } from '@/models/api/Partner';
import { User } from '@/models/api/User';

export interface PartnerProfile extends Partner {
  description: string;
}

export interface PartnerMembers {
  members: Member[];
  captains: Captain[];
}

export interface Member extends User {
  position: string;
  isCaptain: boolean;
}

export interface Captain extends User {
  position: string;
}
