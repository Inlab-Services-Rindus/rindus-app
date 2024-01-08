// import { Suggestion } from '@/modules/search/domain/Suggestion';
// import { UserExtended } from '@/modules/users/domain/User';

export const mockSuggestions = {
  languageSuggestions: [
    {
      display: 'spanish',
      query: 'http://localhost:3000/search?keyword=language&id=2',
    },
    {
      display: 'german',
      query: 'http://localhost:3000/search?keyword=language&id=4',
    },
  ],
  positionSuggestions: [
    {
      display: 'Angular 6-8 developer',
      query:
        'http://localhost:3000/search?keyword=position&query=Angular%206-8%20developer',
    },
    {
      display: 'Business Analyst',
      query:
        'http://localhost:3000/search?keyword=position&query=Business%20Analyst',
    },
  ],
  userSuggestions: [
    {
      id: 96,
      profilePictureUrl:
        'http://localhost:3000/avatars/v1/images/2217/large/c9d91f905c7db4c13e8820b4055bcd64f55acac4.png',
      email: 'manfred.ackermann@rindus.de',
      firstName: 'Manfred',
      lastName: 'Ackermann',
      isBirthday: false,
      position: 'System Engineer / DevOps',
      isCaptain: false,
    },
    {
      id: 154,
      profilePictureUrl:
        'http://localhost:3000/avatars/v1/images/2217/large/97c0697ec3b98b4614e367ca21adbefbb7e2c8ff.jpg',
      email: 'sibani.panda@rindus.de',
      firstName: 'Sibani',
      lastName: 'Panda',
      isBirthday: false,
      position: 'Senior Java Developer',
      isCaptain: false,
    },
    {
      id: 160,
      profilePictureUrl:
        'http://localhost:3000/avatars/v1/images/2217/large/280837fc79659c90d02cacd723dc8ccde169212e.png',
      email: 'tiziana.bonanomi@rindus.de',
      firstName: 'Tiziana',
      lastName: 'Bonanomi',
      isBirthday: false,
      position: 'Scrum Master',
      isCaptain: false,
    },
    {
      id: 9,
      profilePictureUrl:
        'http://localhost:3000/avatars/v1/images/2217/large/2652a35c82c3b62abefa1fd7cf6f16cfda520a9e.jpg',
      email: 'alejandro.sanchez@rindus.de',
      firstName: 'Alejandro',
      lastName: 'Sanchez Ortiz',
      isBirthday: false,
      position: 'C++ Software developer',
      isCaptain: false,
    },
    {
      id: 15,
      profilePictureUrl:
        'http://localhost:3000/avatars/v1/images/2217/large/d672da57c8f2a1c9878d664e32b7810e4ead5137.png',
      email: 'ana.fernandez@rindus.de',
      firstName: 'Ana',
      lastName: 'Fernandez Ruiz',
      isBirthday: false,
      position: 'QA Engineer',
      isCaptain: false,
    },
  ],
};
