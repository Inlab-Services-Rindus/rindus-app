import { Converter } from '@/models/Converter';
import { User as BusinessUser } from '@/models/business/User';
import { IndexUser, ShowUser } from '@/models/api/User';
import { UserLogin } from '@/models/api/User';

export class IndexUserConverter implements Converter<BusinessUser, IndexUser> {
  convert(source: BusinessUser): IndexUser {
    const today = new Date();

    return {
      id: source.id,
      email: source.email,
      firstName: source.firstName,
      lastName: source.lastName,
      profilePictureUrl: source.pictureUrl,
      isBirthday: this.isBirthday(source, today),
    };
  }

  private isBirthday(businessUser: BusinessUser, today: Date): boolean {
    if (!businessUser.birthday) {
      return false;
    }

    const months: { [x: string]: number } = {
      Jan: 1,
      Feb: 2,
      Mar: 3,
      Apr: 4,
      May: 5,
      Jun: 6,
      Jul: 7,
      Aug: 8,
      Sep: 9,
      Oct: 10,
      Nov: 11,
      Dec: 12,
    };

    const [monthName, dayString] = businessUser.birthday.split(' ');
    const birthdayMonth = months[monthName];
    const birthdayDay = Number(dayString);

    return birthdayDay === today.getDay() && birthdayMonth === today.getMonth();
  }
}

export class IndexUserMockBirthdayConverter
  implements Converter<BusinessUser, (_: boolean) => IndexUser>
{
  private readonly indexUserConverter: IndexUserConverter;

  constructor() {
    this.indexUserConverter = new IndexUserConverter();
  }

  convert(source: BusinessUser): (_: boolean) => IndexUser {
    const user = this.indexUserConverter.convert(source);

    return (mockBirthday: boolean) => ({
      ...user,
      isBirthday: mockBirthday || user.isBirthday,
    });
  }
}

export class ShowUserConverter
  implements Converter<[BusinessUser, string[]], ShowUser>
{
  private readonly indexUserConverter: IndexUserConverter;

  constructor() {
    this.indexUserConverter = new IndexUserConverter();
  }

  convert(source: [BusinessUser, string[]]): ShowUser {
    const [user, languages] = source;

    return {
      ...this.indexUserConverter.convert(user),
      position: user.position,
      office: user.office,
      partner: user.partner,
      languages,
    };
  }
}

export class UserLoginConverter implements Converter<BusinessUser, UserLogin> {
  convert(source: BusinessUser): UserLogin {
    return {
      id: source.id,
      profilePictureUrl: source.pictureUrl,
    };
  }
}
