import { IndexUser } from '@/models/api/User';
import {
  IndexUserMockBirthdayConverter,
  ShowUserConverter,
} from '@/models/api/converters/User.converter';
import { LanguageRepository } from '@/repository/language.repository';
import { UserRepository } from '@/repository/user.repository';

export class UserPrograms {
  private readonly userRepository: UserRepository;

  private readonly languageRepository: LanguageRepository;

  private readonly indexUserMockBirthdayConverter: IndexUserMockBirthdayConverter;

  private readonly showUserConverter: ShowUserConverter;

  constructor(
    userRepository: UserRepository,
    languageRepository: LanguageRepository,
  ) {
    this.userRepository = userRepository;
    this.languageRepository = languageRepository;
    this.indexUserMockBirthdayConverter = new IndexUserMockBirthdayConverter();
    this.showUserConverter = new ShowUserConverter();
  }

  public async index(mockBirthdays: boolean): Promise<IndexUser[]> {
    const users = await this.userRepository.all();

    return users.map((businessUser, index) => {
      let mockBirthday = false;
      if (mockBirthdays && index < 3) {
        mockBirthday = true;
      }
      return this.indexUserMockBirthdayConverter.convert(businessUser)(
        mockBirthday,
      );
    });
  }

  public async show(userId: string): Promise<IndexUser | undefined> {
    const [maybeUser, languages] = await Promise.all([
      this.userRepository.findUserById(userId),
      this.languageRepository.userLanguagesById(userId),
    ]);

    return maybeUser
      ? this.showUserConverter.convert([maybeUser, languages])
      : undefined;
  }
}
