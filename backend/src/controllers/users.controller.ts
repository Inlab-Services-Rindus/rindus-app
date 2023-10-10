import { Request, Response } from 'express';

import { UserPrograms } from '@/programs/user';

export class UsersController {
  private readonly userPrograms: UserPrograms;

  constructor(userPrograms: UserPrograms) {
    this.userPrograms = userPrograms;
  }

  public async index(_request: Request, response: Response) {
    const users = await this.userPrograms.index();

    return response.send(users);
  }
}
