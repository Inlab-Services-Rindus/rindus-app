import { Converter } from '@/models/Converter';
import {
  User as BusinessUser,
  WithInfo,
  LoggedInUser,
} from '@/models/business/User';
import {
  LoggedInUser as ApiLoggedInUser,
  ShowUser,
  User as ApiUser,
  UserResult,
  PaginatedIndex,
} from '@/models/api/User';
import { fromRecordId } from '@/helpers/RecordConverterHelper';
import { Language } from '@/models/business/Language';

export class LoggedInUserConverter
  implements Converter<LoggedInUser, ApiLoggedInUser>
{
  convert(source: LoggedInUser): ApiLoggedInUser {
    return {
      id: fromRecordId(source.id),
      profilePictureUrl: source.pictureUrl,
    };
  }
}

export class UserConverter implements Converter<BusinessUser, ApiUser> {
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
  implements Converter<[BusinessUser & WithInfo, Language[]], ShowUser>
{
  private readonly userConverter: UserConverter;

  constructor() {
    this.userConverter = new UserConverter();
  }

  convert(source: [BusinessUser & WithInfo, Language[]]): ShowUser {
    const [user, languages] = source;

    return {
      ...this.userConverter.convert(user),
      position: user.position,
      office: user.office,
      partner: user.partner,
      languages,
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

export class PaginatedIndexConverter
  implements Converter<[BusinessUser[], number], PaginatedIndex>
{
  private readonly userConverter: UserConverter;

  constructor() {
    this.userConverter = new UserConverter();
  }

  convert(source: [BusinessUser[], number]): PaginatedIndex {
    const [users, totalPages] = source;

    return {
      users: users.map((user) => this.userConverter.convert(user)),
      totalPages,
    };
  }
}
