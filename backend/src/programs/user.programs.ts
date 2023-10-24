import { User } from '@/models/api/User';
import { ApiUserConverter } from '@/models/api/converters/User.converter';
import { UserRepository } from '@/repository/user.repository';

export class UserPrograms {
  private readonly userRepository: UserRepository;

  private readonly apiUserConverter: ApiUserConverter;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
    this.apiUserConverter = new ApiUserConverter(new Date());
  }

  public async index(mockBirthdays: boolean): Promise<User[]> {
    const users = await this.userRepository.all();

    return users.map((businessUser, index) => {
      let mockBirthday = false;
      if (mockBirthdays && index < 3) {
        mockBirthday = true;
      }
      return this.apiUserConverter.convert(businessUser)(mockBirthday);
    });
  }
}
