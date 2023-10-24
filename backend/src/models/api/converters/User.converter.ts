import { Converter } from '@/models/Converter';
import { User as BusinessUser } from '@/models/business/User';
import { User as ApiUser } from '@/models/api/User';
import { UserLogin as ApiUserLogin } from '@/models/api/User';

export class ApiUserConverter
  implements Converter<BusinessUser, (_: boolean) => ApiUser>
{
  private readonly date: Date;

  constructor(date: Date) {
    this.date = date;
  }

  convert(source: BusinessUser): (_: boolean) => ApiUser {
    return (mockBirthday: boolean) => ({
      id: source.id,
      email: source.email,
      firstName: source.firstName,
      lastName: source.lastName,
      profilePictureUrl: source.pictureUrl,
      isBirthday: mockBirthday || this.isBirthday(source, this.date),
    });
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

export class ApiUserLoginConverter
  implements Converter<BusinessUser, ApiUserLogin>
{
  convert(source: BusinessUser): ApiUserLogin {
    return {
      id: source.id,
      profilePictureUrl: source.pictureUrl,
    };
  }
}
