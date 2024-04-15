import { Page } from '@/models/business/Pagination';
import { User, WithInfo, WithLanguages } from '@/models/business/User';
import { UserRepository } from '@/repository/user.repository';

export class UserPrograms {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async index(
    page: number,
    pageSize: number,
    mockBirthdays: boolean,
    sessionUserId: number,
  ): Promise<Page<User>> {
    const usersPage = await this.userRepository.page(
      page,
      pageSize,
      sessionUserId,
    );
    const { data: users } = usersPage;

    return {
      ...usersPage,
      data: page === 1 ? this.mockIsBirthday(users, mockBirthdays) : users,
    };
  }

  private mockIsBirthday(users: User[], mockBirthdays: boolean): User[] {
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

  public async show(
    userId: number,
  ): Promise<(User & WithInfo & WithLanguages) | undefined> {
    return this.userRepository.findUserWithInfo(userId);
  }
}
