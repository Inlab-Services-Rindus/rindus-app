import { Converter } from '@/converters/Converter';
import {
  User as BusinessUser,
  WithInfo,
  WithLanguages,
} from '@/models/business/User';
import { User as ApiUser } from '@/models/api/User';
import { ShowUser } from '@/models/api/users/Show';
import { UserResult } from '@/models/api/search/Search';
import { Page } from '@/models/business/Pagination';
import { UsersIndex } from '@/models/api/users/Index';
import { LoggedInUserConverter } from '@/converters/api/Session.converter';

class UserConverter implements Converter<BusinessUser, ApiUser> {
  private readonly userLoginConverter: LoggedInUserConverter;

  constructor() {
    this.userLoginConverter = new LoggedInUserConverter();
  }

  convert(source: BusinessUser): ApiUser {
    return {
      ...this.userLoginConverter.convert(source),
      email: source.email,
      firstName: source.firstName,
      lastName: source.lastName,
      fullName: source.fullName,
      isBirthday: source.isBirthday,
    };
  }
}

export class ShowUserConverter
  implements Converter<BusinessUser & WithInfo & WithLanguages, ShowUser>
{
  private readonly userConverter: UserConverter;

  constructor() {
    this.userConverter = new UserConverter();
  }

  convert(source: BusinessUser & WithInfo & WithLanguages): ShowUser {
    return {
      ...this.userConverter.convert(source),
      position: source.position,
      office: source.office,
      partner: source.partner,
      languages: source.languages,
    };
  }
}

export class UserResultConverter
  implements Converter<BusinessUser, UserResult>
{
  private readonly loggedInUserConverter: LoggedInUserConverter;

  constructor() {
    this.loggedInUserConverter = new LoggedInUserConverter();
  }

  convert(source: BusinessUser): UserResult {
    return {
      ...this.loggedInUserConverter.convert(source),
      fullName: source.fullName,
      position: source.position,
      isBirthday: source.isBirthday,
    };
  }
}

export class UsersIndexConverter
  implements Converter<Page<BusinessUser>, UsersIndex>
{
  private readonly userConverter: UserConverter;

  constructor() {
    this.userConverter = new UserConverter();
  }

  convert(source: Page<BusinessUser>): UsersIndex {
    return {
      data: source.data.map((user) => this.userConverter.convert(user)),
      totalPages: source.totalPages,
    };
  }
}
