import { UserRepository } from '@/repository/user';
import { JwtValidator } from '@/services/jwt-validator';

export class SessionPrograms {
  private readonly jwtValidator: JwtValidator;

  private readonly userRepository: UserRepository;

  constructor(jwtValidator: JwtValidator, userRepository: UserRepository) {
    this.jwtValidator = jwtValidator;
    this.userRepository = userRepository;
  }

  public async login(jwt: string): Promise<string | undefined> {
    const email = await this.jwtValidator.validateToken(jwt);

    if (email !== undefined) {
      const userId = await this.userRepository.findUserId(email);

      if (userId !== undefined) {
        return userId;
      }
    }

    return undefined;
  }
}
