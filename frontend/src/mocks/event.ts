interface Event {
  title: string;
  month: string;
  day: string;
  isBoldTitle?: boolean;
  weekday: string;
  isSurveyFilled?: boolean;
  isButtonVisible?: boolean;
  description: string;
  location: {
    url: string;
    name: string;
    address: string;
  };
  time: string;
  petsAllowed: true;
}

export const eventMock: Event = {
  title: 'Woman Day',
  month: 'May',
  day: '08',
  isBoldTitle: true,
  weekday: 'Friday',
  isSurveyFilled: false,
  isButtonVisible: true,
  description:
    '\u003cp\u003e:tada: Welcome Lunch for New Team Members! :knife_fork_plate:\u003c/p\u003e\u003cp\u003eLet’s celebrate our awesome new colleagues with a delicious lunch! Join us for good food and great company as we welcome them to the team.\u003c/p\u003e',
  location: {
    url: 'www.zoom.com',
    name: 'Rindus Office',
    address: 'C/ Severo Ochoa, 8',
  },
  time: '13:00 - 15:00',
  petsAllowed: true,
};
