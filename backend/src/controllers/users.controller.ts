import { Request, Response } from 'express';

import { UserPrograms } from '@/programs/user.programs';

export class UsersController {
  private readonly userPrograms: UserPrograms;
  private static readonly MOCK_BIRTHDAYS_HTTP_HEADER = 'X-Mock-Birthdays';

  constructor(userPrograms: UserPrograms) {
    this.userPrograms = userPrograms;
  }

  public async index(request: Request, response: Response) {
    const mockBirthdays =
      request.headers[UsersController.MOCK_BIRTHDAYS_HTTP_HEADER.toLowerCase()];
    const users = await this.userPrograms.index(!!mockBirthdays);

    return response.send(users);
  }
}
