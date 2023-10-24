import { User } from '@/models/api/User';
import { User as BusinessUser } from '@/models/business/User';
import { UserRepository } from '@/repository/user.repository';

export class UserPrograms {
  private readonly userRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async index(mockBirthdays: boolean): Promise<User[]> {
    const users = await this.userRepository.all();

    const today = new Date();
    return users.map((businessUser, index) => {
      let mockBirthday = false;
      if (mockBirthdays && index < 3) {
        mockBirthday = true;
      }
      return this.mapApiUser(businessUser, today, mockBirthday);
    });
  }

  private mapApiUser(
    businessUser: BusinessUser,
    today: Date,
    mockBirthday: boolean,
  ): User {
    return {
      firstName: businessUser.firstName,
      lastName: businessUser.lastName,
      email: businessUser.email,
      profilePictureUrl: businessUser.profilePictureUrl,
      isBirthday: mockBirthday || this.isBirthday(businessUser, today),
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
