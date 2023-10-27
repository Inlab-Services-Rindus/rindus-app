import { isBirthday } from '@/helpers/WithBirthdayHelper';
import { IndexUser, ShowUser } from '@/models/api/User';
import {
  IndexUserConverter,
  ShowUserConverter,
} from '@/models/api/converters/User.converter';
import { User, WithBirthday } from '@/models/business/User';
import { LanguageRepository } from '@/repository/language.repository';
import { UserRepository } from '@/repository/user.repository';

export class UserPrograms {
  private readonly userRepository: UserRepository;

  private readonly languageRepository: LanguageRepository;

  private readonly indexUserConverter: IndexUserConverter;

  private readonly showUserConverter: ShowUserConverter;

  constructor(
    userRepository: UserRepository,
    languageRepository: LanguageRepository,
  ) {
    this.userRepository = userRepository;
    this.languageRepository = languageRepository;
    this.indexUserConverter = new IndexUserConverter();
    this.showUserConverter = new ShowUserConverter();
  }

  public async index(mockBirthdays: boolean): Promise<IndexUser[]> {
    const users = await this.userRepository.all();

    return this.enrichIsBirthday(users, mockBirthdays).map((user) =>
      this.indexUserConverter.convert(user),
    );
  }

  private enrichIsBirthday(
    users: User[],
    mockBirthdays: boolean,
  ): (User & WithBirthday)[] {
    return users.map((user, index) => {
      let mockBirthday = false;
      if (mockBirthdays && index < 3) {
        mockBirthday = true;
      }

      return {
        ...user,
        isBirthday: mockBirthday || isBirthday(user.birthday),
      };
    });
  }

  public async show(userId: string): Promise<ShowUser | undefined> {
    const [maybeUser, languages] = await Promise.all([
      this.userRepository.findUserWithInfoById(userId),
      this.languageRepository.userLanguagesById(userId),
    ]);

    return maybeUser
      ? this.showUserConverter.convert([maybeUser, languages])
      : undefined;
  }
}
