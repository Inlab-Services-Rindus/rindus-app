import { Converter } from '@/models/Converter';
import {
  User as BusinessUser,
  WithBirthday,
  WithInfo,
  LoggedInUser,
} from '@/models/business/User';
import {
  LoggedInUser as ApiLoggedInUser,
  IndexUser,
  ShowUser,
  User as ApiUser,
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
    };
  }
}

export class IndexUserConverter
  implements Converter<BusinessUser & WithBirthday, IndexUser>
{
  private readonly userConverter: UserConverter;

  constructor() {
    this.userConverter = new UserConverter();
  }

  convert(source: BusinessUser & WithBirthday): IndexUser {
    return {
      ...this.userConverter.convert(source),
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
