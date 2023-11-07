import { Language } from '@/models/business/Language';
import { Partner } from '@/models/business/Partner';

export interface LoggedInUser {
  id: number;
  pictureUrl: string;
}

export interface User extends LoggedInUser {
  firstName: string;
  lastName?: string;
  email: string;
  position: string;
  birthday?: string;
  isBirthday: boolean;
}

export interface WithInfo {
  partner?: Partner;
  office: string;
  slack: Slack;
}

export interface Slack {
  name: string;
  slackId: string;
  profileUrl: string;
}

export interface WithLanguages {
  languages: Language[];
}
