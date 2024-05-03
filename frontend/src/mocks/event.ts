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
    }
    time: string;
    petsAllowed: true;
  }
  
 export const eventMock:Event = {
    title: 'Woman Day',
    month: 'May',
    day: '08',
    isBoldTitle: true,
    weekday: 'Friday',
    isSurveyFilled: false,
    isButtonVisible: true,
    description: 'Hello rindus crew, Lorem ipsum dolor sit amet consectetur. Imperdiet molestie gravida duis dignissim elementum id risus. Tincidunt sem auctor eget eget at purus magna.Molestie gravida duis dignissim elementum id risus.Bibendum massa urna purus vel aliquet sollicitudin libero nibh sagittis.',
    location: {
      'url': 'www.zoom.com',
      'name': 'Rindus Office',
      'address': 'C/ Severo Ochoa, 8'
    },
    time: '13:00 - 15:00',
    petsAllowed: true,
  };