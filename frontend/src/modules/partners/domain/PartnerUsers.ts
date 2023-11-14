import { UserExtended } from '@/modules/users/domain/User';

export interface PartnerUsers {
  members: UserExtended[];
  captains: UserExtended[];
}
