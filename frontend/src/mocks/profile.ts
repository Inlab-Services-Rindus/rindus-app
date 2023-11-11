import { EmployeeProfile } from '@/model/Employee';

export const mockProfile: EmployeeProfile = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  position: 'Software Engineer',
  email: 'johndoe@example.com',
  office: 'Málaga',
  department: {
    id: 2,
    name: 'Douglas',
    logoUrl: 'https://example.com/logo.png',
  },
  slack: {
    name: 'johndoe',
    profileUrl: 'https://example.slack.com/team/johndoe',
  },
  languages: ['english', 'spanish'],
  profilePictureUrl: 'https://example.com/profile.png',
  isBirthday: false,
};
