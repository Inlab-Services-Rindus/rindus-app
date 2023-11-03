import { Request, Response } from 'express';

import { UserPrograms } from '@/programs/user.programs';
import { parsePageQueryParam } from '@/helpers/RequestHelper';
import { toRecordId } from '@/helpers/RecordConverterHelper';
import {
  ShowUserConverter,
  UsersIndexConverter,
} from '@/converters/api/User.converter';

export class UsersController {
  private static readonly MOCK_BIRTHDAYS_HTTP_HEADER = 'X-Mock-Birthdays';

  private readonly userPrograms: UserPrograms;

  private readonly usersIndexConverter: UsersIndexConverter;

  private readonly showUserConverter: ShowUserConverter;

  constructor(userPrograms: UserPrograms) {
    this.userPrograms = userPrograms;
    this.usersIndexConverter = new UsersIndexConverter();
    this.showUserConverter = new ShowUserConverter();
  }

  public async index(request: Request, response: Response) {
    const mockBirthdays =
      request.headers[UsersController.MOCK_BIRTHDAYS_HTTP_HEADER.toLowerCase()];
    const page = parsePageQueryParam(request);

    const users = await this.userPrograms.index(!!mockBirthdays, page);

    const index = this.usersIndexConverter.convert(users);

    return response.send(index);
  }

  public async show(request: Request, response: Response) {
    const userIdParam = request.params.userId;

    const maybeUserId = toRecordId(userIdParam);

    if (maybeUserId) {
      const maybeUser = await this.userPrograms.show(maybeUserId);

      if (maybeUser) {
        const user = this.showUserConverter.convert(maybeUser);
        return response.send(user);
      }
    }

    return response.sendStatus(404);
  }
}
