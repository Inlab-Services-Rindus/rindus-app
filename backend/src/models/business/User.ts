export interface User {
  id: string;
  firstName: string;
  lastName?: string;
  fullName: string;
  email: string;
  partner?: string;
  office: string;
  pictureUrl: string;
  birthday?: string;
  position?: string;
}
