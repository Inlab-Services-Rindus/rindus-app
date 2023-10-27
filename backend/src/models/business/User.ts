import { Language } from '@/models/business/Language';

export interface LoggedInUser {
  id: number;
  pictureUrl: string;
}

export interface User extends LoggedInUser {
  firstName: string;
  lastName?: string;
  fullName: string;
  email: string;
  position?: string;
  birthday?: string;
}

export interface WithBirthday {
  isBirthday: boolean;
}

export interface WithInfo {
  partner?: string;
  office: string;
}

export interface WithLanguages {
  languages: Language[];
}
