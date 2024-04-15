import { LoggedInUser } from '@/models/business/User';
import { UserRepository } from '@/repository/user.repository';
import { JwtValidator } from '@/services/jwt-validator';

export class SessionPrograms {
  private readonly jwtValidator: JwtValidator;

  private readonly userRepository: UserRepository;

  constructor(jwtValidator: JwtValidator, userRepository: UserRepository) {
    this.jwtValidator = jwtValidator;
    this.userRepository = userRepository;
  }

  public async login(jwt: string): Promise<LoggedInUser | undefined> {
    const email = await this.jwtValidator.validateToken(jwt);

    if (email !== undefined) {
      const user = await this.userRepository.findUserByEmail(email);

      if (user !== undefined) {
        return user;
      }
    }

    return undefined;
  }
}
