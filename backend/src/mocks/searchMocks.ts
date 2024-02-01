import { Suggestions } from '@/models/business/Suggestions';
import { User } from '@/models/business/User';
import { UserResult } from '@/models/api/search/Search';

export const suggestionsMock: Suggestions = {
  languages: [
    {
      display: 'english',
      query: 'http://example.com/search?keyword=language&id=42',
    },
  ],
  positions: [],
  users: [
    {
      asciiFirstName: 'John',
      asciiLastName: 'Doe',
      id: 201,
      pictureUrl: 'http://example.com/avatar5.jpg',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      position: 'Frontend Developer',
      birthday: 'Sep 5',
      isBirthday: false,
      isTeamCaptain: false,
    },
  ],
};

export const convertedSuggestionsMock = {
  languageSuggestions: [
    {
      display: 'english',
      query: 'http://example.com/search?keyword=language&id=42',
    },
  ],
  positionSuggestions: [],
  userSuggestions: [
    {
      id: 201,
      profilePictureUrl: 'http://example.com/avatar5.jpg',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      isBirthday: false,
      position: 'Frontend Developer',
      isCaptain: false,
    },
  ],
};

export const suggestionsByLanguageResponseMock: User[] = [
  {
    id: 1,
    pictureUrl: 'http://example.com/avatar1.jpg',
    firstName: 'John',
    asciiFirstName: 'john',
    lastName: 'Doe',
    asciiLastName: 'doe',
    email: 'john.doe@example.com',
    position: 'Frontend Developer',
    birthday: 'Jan 15',
    isBirthday: false,
    isTeamCaptain: false,
  },
  {
    id: 2,
    pictureUrl: 'http://example.com/avatar2.jpg',
    firstName: 'Jane',
    asciiFirstName: 'jane',
    lastName: 'Smith',
    asciiLastName: 'smith',
    email: 'jane.smith@example.com',
    position: 'Backend Developer',
    birthday: 'Feb 20',
    isBirthday: false,
    isTeamCaptain: false,
  },
];

export const convertedSuggestionsByLanguageResponseMock: UserResult[] = [
  {
    id: 1,
    profilePictureUrl: 'http://example.com/avatar1.jpg',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    isBirthday: false,
    position: 'Frontend Developer',
    isCaptain: false,
  },
  {
    id: 2,
    profilePictureUrl: 'http://example.com/avatar2.jpg',
    email: 'jane.smith@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    isBirthday: false,
    position: 'Backend Developer',
    isCaptain: false,
  },
];
