import { UserRepository } from '@/repository/user';

export class UserPrograms {
  private readonly userRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public index() {
    return this.userRepository.all();
  }
}
