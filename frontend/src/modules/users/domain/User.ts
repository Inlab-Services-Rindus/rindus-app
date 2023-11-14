export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profilePictureUrl: string;
  isBirthday: boolean;
}

export interface UserExtended extends User {
  position: string;
  office: string;
  department: {
    id: number | null;
    name: string;
    logoUrl: string;
  };
  languages: string[];
  slack: {
    name: string;
    profileUrl: string;
  };
}
