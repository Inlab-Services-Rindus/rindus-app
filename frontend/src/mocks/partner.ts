import { Partner } from '@/model/Partner';

export const partnerMock: Partner = {
  description: 'A rindus partner',
  id: 2,
  logoUrl: 'http://localhost:3000/images/partners/douglas.svg',
  name: 'Douglas',
};

export const partnerMembersMock = {
  members: [
    {
      id: 2,
      profilePictureUrl:
        'http://localhost:3000/avatars/v1/images/2217/large/70ea8090cf0bf9e0927815b4cbbe17162f4e0788.png',
      email: 'adrian.gonzalez@rindus.de',
      firstName: 'Adrián',
      lastName: 'González Leiva',
      isBirthday: false,
      position: 'Scala Developer',
    },
    {
      id: 5,
      profilePictureUrl:
        'http://localhost:3000/avatars/v1/images/2217/large/903ae5c45326ac5e58e67e34c2a5554950449a42.jpg',
      email: 'aladji.fall@rindus.de',
      firstName: 'Aladji Makha',
      lastName: 'Fall Sow',
      isBirthday: false,
      position: 'Service Engineer',
    },
    {
      id: 7,
      profilePictureUrl:
        'http://localhost:3000/avatars/v1/images/2217/large/b2524df37995ba38cb067ee780abe1144f510c02.png',
      email: 'alberto.garcia@rindus.de',
      firstName: 'Alberto',
      lastName: 'Garcia Criado',
      isBirthday: false,
      position: 'Service Desk Engineer',
    },
  ],
  captains: [
    {
      id: 12,
      profilePictureUrl:
        'http://localhost:3000/avatars/v1/images/2217/large/9dbbb0531450294cc5cc23e132687dda2da6408b.png',
      email: 'alicia.sintas@rindus.de',
      firstName: 'Alicia',
      lastName: 'Sintas Checa',
      isBirthday: false,
      position: 'Senior People Partner',
    },
    {
      id: 128,
      profilePictureUrl:
        'http://localhost:3000/avatars/v1/images/2217/large/2e05831346a8a4965212a2c30bdd7a5c45f8ca45.jpg',
      email: 'paola.bueno@rindus.de',
      firstName: 'Paola',
      lastName: 'Bueno Cuesta',
      isBirthday: false,
      position: 'Senior People Partner',
    },
  ],
};
