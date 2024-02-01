import { User, WithInfo, WithLanguages } from '@/models/business/User';

export const userWithInfoAndLanguagesMock: User & WithInfo & WithLanguages = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  position: 'Software Engineer',
  email: 'johndoe@example.com',
  office: 'Málaga',
  partner: {
    id: 2,
    name: 'Douglas',
    description: 'Douglas description',
    logoUrl: 'https://example.com/logo.png',
  },
  slack: {
    slackId: '123456789',
    name: 'johndoe',
    profileUrl: 'https://example.slack.com/team/johndoe',
  },
  languages: [
    {
      id: 1,
      name: 'English',
    },
    {
      id: 2,
      name: 'Spanish',
    },
  ],
  asciiFirstName: 'John',
  asciiLastName: 'Doe',
  pictureUrl: 'https://example.com/picture.png',
  isTeamCaptain: false,
  isBirthday: false,
};
