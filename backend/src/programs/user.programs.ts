import { IndexUser, PaginatedIndex, ShowUser } from '@/models/api/User';
import {
  PaginatedIndexConverter,
  ShowUserConverter,
  UserConverter,
} from '@/models/api/converters/User.converter';
import { User } from '@/models/business/User';
import { LanguageRepository } from '@/repository/language.repository';
import { UserRepository } from '@/repository/user.repository';

export class UserPrograms {
  private readonly userRepository: UserRepository;

  private readonly languageRepository: LanguageRepository;

  private readonly userConverter: UserConverter;

  private readonly paginatedIndexConverter: PaginatedIndexConverter;

  private readonly showUserConverter: ShowUserConverter;

  constructor(
    userRepository: UserRepository,
    languageRepository: LanguageRepository,
  ) {
    this.userRepository = userRepository;
    this.languageRepository = languageRepository;
    this.userConverter = new UserConverter();
    this.showUserConverter = new ShowUserConverter();
    this.paginatedIndexConverter = new PaginatedIndexConverter();
  }

  public async index(
    mockBirthdays: boolean,
    page: number,
  ): Promise<PaginatedIndex> {
    const [users, totalPages] = await Promise.all([
      this.userRepository.page(page),
      this.userRepository.totalPages(),
    ]);

    return this.paginatedIndexConverter.convert([
      this.mockIsBirthday(users, mockBirthdays, page),
      totalPages,
    ]);
  }

  private mockIsBirthday(
    users: User[],
    mockBirthdays: boolean,
    page: number,
  ): User[] {
    if (page > 1) {
      return users;
    }

    return users.map((user, index) => {
      let mockBirthday = false;
      if (mockBirthdays && index < 3) {
        mockBirthday = true;
      }

      return {
        ...user,
        isBirthday: mockBirthday || user.isBirthday,
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
