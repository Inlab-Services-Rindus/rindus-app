import { User } from '@/models/api/User';

export interface ShowUser extends User {
  languages: string[];
  office: string;
  partner?: string;
  position?: string;
}
