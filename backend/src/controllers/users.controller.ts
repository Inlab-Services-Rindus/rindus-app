import { Request, Response } from 'express';

import { UserPrograms } from '@/programs/user.programs';

export class UsersController {
  private static readonly MOCK_BIRTHDAYS_HTTP_HEADER = 'X-Mock-Birthdays';

  private readonly userPrograms: UserPrograms;

  constructor(userPrograms: UserPrograms) {
    this.userPrograms = userPrograms;
  }

  public async index(request: Request, response: Response) {
    const mockBirthdays =
      request.headers[UsersController.MOCK_BIRTHDAYS_HTTP_HEADER.toLowerCase()];
    const users = await this.userPrograms.index(!!mockBirthdays);

    return response.send(users);
  }

  public async show(request: Request, response: Response) {
    const userId = request.params.userId;

    const maybeUser = await this.userPrograms.show(userId);

    if (maybeUser) {
      return response.send(maybeUser);
    } else {
      return response.sendStatus(404);
    }
  }
}
